import React, { ReactElement, useState, useEffect, useRef } from 'react';
import AutomationComponent from '../../components/automation/automation';
import {
  AutomationColumn,
  FloatingButton,
  IconAdd,
  HeatmapElement,
  AutomationRow,
  Automations,
} from './automations-items';
import { Input, FieldLabel } from '../../components/form/form-items';
import Modal from '../../components/modal/modal';
import Button from '../../components/button/button';
import Table from '../../components/table/table';
import SystemApiRepository from '../../infrastructure/system-api/system-api-repository';
import AutomationApiRepository, {
  UpdateSubscriptionRequestObject,
} from '../../infrastructure/automation-api/automation-api-repository';
import AccountDto from '../../infrastructure/account-api/account-dto';
import AccountApiRepository from '../../infrastructure/account-api/account-api-repository';
import AutomationDto from '../../infrastructure/automation-api/automation-dto';
import SelectorApiRepository from '../../infrastructure/selector-api/selector-api-repository';
import SelectorDto from '../../infrastructure/selector-api/selector-dto';
import {
  buildDateKey,
  buildHeatmapData,
  DateData,
  generateDateDataStub,
  Heatmap,
  HeatmapData,
} from '../../components/heatmap/heatmap';
import SubscriptionDto from '../../infrastructure/automation-api/subscription-dto';
import AlertDto from '../../infrastructure/selector-api/alert-dto';

interface OldestAlertsAccessedOnByUser {
  automationIds: string[];
  selectorId: string;
  alertsAccessedOnByUser: number;
}

const isWhitespaceString = (text: string): boolean => !/\S/.test(text);

const getDateData = (
  startDate: Date,
  endDate: Date,
  selectors: SelectorDto[]
): DateData => {
  const dateRegistry = generateDateDataStub(startDate, endDate);

  selectors.forEach((selector) => {
    const relevantAlerts = selector.alerts.filter(
      (alert) =>
        alert.createdOn >= startDate.getTime() &&
        alert.createdOn <= endDate.getTime()
    );
    relevantAlerts.forEach((alert) => {
      dateRegistry[buildDateKey(new Date(alert.createdOn))] += 1;
    });
  });
  return dateRegistry;
};

const getHeatmapData = (selectors: SelectorDto[]): HeatmapData => {
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - 7 * 20 + 1);

  startDate.setUTCHours(0);
  startDate.setUTCMinutes(0);
  startDate.setUTCSeconds(0);
  startDate.setUTCMilliseconds(0);

  const endDate = new Date();
  endDate.setUTCHours(23);
  endDate.setUTCMinutes(59);
  endDate.setUTCSeconds(59);
  endDate.setUTCMilliseconds(999);

  const dateRegistry = getDateData(startDate, endDate, selectors);

  const heatmapData = buildHeatmapData(startDate, endDate, dateRegistry);

  return heatmapData;
};

const buildSubscribeButton = (
  selectorId: string,
  setSubscriptionState: (selectorId: string, state: boolean) => void
): ReactElement => {
  const handleSubscriptionState = (checked: boolean) => {
    setSubscriptionState(selectorId, checked);
  };

  return (
    <input
      type="checkbox"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        handleSubscriptionState(event.target.checked)
      }
      defaultChecked
    />
  );
};

const getSubscriptionInfo = async (
  subscriptions: SubscriptionDto[],
  automationId: string,
  setSubscriptionState: (selectorId: string, state: boolean) => void
): Promise<any[][]> => {
  const subscriptionInfo: any[][] = [];

  try {
    await Promise.all(
      subscriptions.map(async (subscription) => {
        const selector = await SelectorApiRepository.getOne(
          subscription.selectorId
        );
        const system = await SystemApiRepository.getOne(subscription.systemId);

        if (!selector)
          throw new Error(
            `Subscription of automation ${automationId} for selector ${subscription.selectorId} invalid. Selector does not exist`
          );
        if (!system)
          throw new Error(
            `Subscription of automation ${automationId} for system${subscription.systemId} invalid. System does not exist`
          );

        setSubscriptionState(subscription.selectorId, true);

        subscriptionInfo.push([
          system.name,
          system.id,
          selector.content,
          selector.id,
          buildSubscribeButton(selector.id, setSubscriptionState),
        ]);
      })
    );

    return subscriptionInfo;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const updateAlertAccessedOnValues = async (
  automationId: string,
  subscriptions: SubscriptionDto[]
): Promise<SubscriptionDto[]> => {
  try {
    const updatedSubscriptionObjects: UpdateSubscriptionRequestObject[] =
      subscriptions.map((element) => ({
        selectorId: element.selectorId,
        alertsAccessedOnByUser: Date.now(),
      }));

    const updatedSubscriptions =
      await AutomationApiRepository.updateSubscriptions(
        automationId,
        updatedSubscriptionObjects
      );

    if (updatedSubscriptionObjects.length && !updatedSubscriptions.length)
      throw new Error(
        `Update of subscriptions of automation ${automationId} failed`
      );

    return updatedSubscriptions;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getOldestAlertsAccessedOnByUser = async (
  userId: string
): Promise<OldestAlertsAccessedOnByUser[]> => {
  const accessedOnByUserElements: OldestAlertsAccessedOnByUser[] = [];

  try {
    const accounts: AccountDto[] = await AccountApiRepository.getBy(
      new URLSearchParams({ userId })
    );

    if (!accounts.length)
      throw new Error(`No accounts found for user ${userId}`);

    const automations: AutomationDto[] = await AutomationApiRepository.getBy(
      new URLSearchParams({ accountId: accounts[0].id })
    );

    automations.forEach((automation) => {
      automation.subscriptions.forEach((subscription) => {
        const selectorAccessedOnByUser = accessedOnByUserElements.find(
          (element) => element.selectorId === subscription.selectorId
        );

        if (!selectorAccessedOnByUser)
          accessedOnByUserElements.push({
            automationIds: [automation.id],
            selectorId: subscription.selectorId,
            alertsAccessedOnByUser: subscription.alertsAccessedOnByUser,
          });
        else if (
          subscription.alertsAccessedOnByUser <
          selectorAccessedOnByUser.alertsAccessedOnByUser
        ) {

          const index = accessedOnByUserElements.findIndex(
            (element) => element.selectorId === subscription.selectorId
          );

            const {automationIds} = selectorAccessedOnByUser;
            if(!automationIds.includes(
              automation.id
            )) automationIds.push(automation.id);

          accessedOnByUserElements[index] = {
            automationIds,
            selectorId: subscription.selectorId,
            alertsAccessedOnByUser: subscription.alertsAccessedOnByUser,
          };
        }
      });
    });
    return accessedOnByUserElements;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const buildRow = (cards: ReactElement[]): ReactElement => (
  <AutomationRow>{cards}</AutomationRow>
);

interface AutomationSelectors {
  id: string;
  selectors: SelectorDto[];
}

const buildRows = (
  automations: AutomationDto[],
  selectors: AutomationSelectors[],
  alertsAccessedOnByUserElements: OldestAlertsAccessedOnByUser[],
  handleAutomationId: (automationId: string) => void,
  handleSubscriptionsState: (state: boolean) => void,
  handleAlertsState: (state: boolean) => void,
  handleOptionsState: (state: boolean) => void,
  handleAlertsOverviewState: (state: boolean) => void
): ReactElement[] => {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let automationCounter = 0;

  automations.forEach((automation) => {
    const automationAccessedOnElements: OldestAlertsAccessedOnByUser[] =
      alertsAccessedOnByUserElements.filter(
        (element) => element.automationIds.includes(automation.id)
      );

    const missedAlerts: AlertDto[] = automationAccessedOnElements.flatMap(
      (element) => {
        const automationSelectors = selectors.find(
          (selector) => selector.id === automation.id
        );

        if (!automationSelectors || !automationSelectors.selectors.length)
          return [];

        const selector = automationSelectors.selectors.find(
          (selectorElement) => selectorElement.id === element.selectorId
        );

        if (!selector) return [];

        const alerts = selector.alerts.filter(
          (alert) => alert.createdOn > element.alertsAccessedOnByUser
        );

        return alerts;
      }
    );

    cards.push(
      <AutomationColumn>
        {AutomationComponent(
          automation.id,
          automation.name,
          missedAlerts.length,
          handleAutomationId,
          handleSubscriptionsState,
          handleAlertsState,
          handleOptionsState,
          handleAlertsOverviewState
        )}
      </AutomationColumn>
    );
    automationCounter += 1;
    if (automationCounter === 4) {
      rows.push(buildRow(cards));
      cards = [];
      automationCounter = 0;
    }
  });

  if (cards !== undefined && cards.length !== 0) {
    rows.push(buildRow(cards));
    cards = [];
  }

  return rows;
};

export default (): ReactElement => {
  const initialRenderFinished = useRef(false);

  const [automations, setAutomations] = useState<AutomationDto[]>([]);

  const [selectors, setSelectors] = useState<
    { id: string; selectors: SelectorDto[] }[]
  >([]);

  const [alertsAccessedOnByUser, setAlertsAccessedOnByUser] = useState<
    OldestAlertsAccessedOnByUser[]
  >([]);

  const [heatmapElement, setHeatmapElement] = useState<ReactElement>();

  const [showAlertsOverviewModal, setShowAlertsOverviewModal] = useState(false);

  const handleAlertsOverviewState = (): void =>
    setShowAlertsOverviewModal(!showAlertsOverviewModal);

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleRegistrationState = (): void =>
    setShowRegistrationModal(!showRegistrationModal);

  const [automationName, setAutomationName] = useState('');

  const [accountId, setAccountId] = useState('');

  const [registrationSubmit, setRegistrationSubmit] = useState(false);

  const handleRegistrationSubmit = (state: boolean): void => {
    if (
      !automationName ||
      isWhitespaceString(automationName) ||
      !accountId ||
      isWhitespaceString(accountId)
    )
      return;
    setRegistrationSubmit(state);
    setShowRegistrationModal(!showRegistrationModal);
  };

  const [automationId, setAutomationId] = useState<string>('');

  const handleAutomationId = (id: string): void => {
    setAutomationId(id);
  };

  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);

  const handleSubscriptionsState = (): void =>
    setShowSubscriptionsModal(!showSubscriptionsModal);

  const [subscriptionsElement, setSubscriptionsElement] =
    useState<ReactElement>();

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleOptionsState = (): void => setShowOptionsModal(!showOptionsModal);

  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const [missedAlertsElement, setMissedAlertsElement] =
    useState<ReactElement>();

  const handleAlertsState = (): void => setShowAlertsModal(!showAlertsModal);

  const [toDelete, setToDelete] = useState(false);

  const [isSubscribedValues, setIsSubscribedValues] = useState<{
    [key: string]: boolean;
  }>({});

  const handleIsSubscribedValue = (
    selectorId: string,
    state: boolean
  ): void => {
    const values = isSubscribedValues;
    values[selectorId] = state;
    setIsSubscribedValues(values);
  };

  const [subscriptionsSubmit, setSubscriptionsSubmit] = useState(false);

  const handleSubscriptionsSubmit = (state: boolean): void => {
    setSubscriptionsSubmit(state);
    setShowSubscriptionsModal(!showSubscriptionsModal);
  };

  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleErrorState = (): void => setShowErrorModal(!showErrorModal);

  const [automationError, setAutomationError] = useState('');

  const renderAutomations = () => {
    AutomationApiRepository.getAll()
      .then((automationDtos) => {
        setAutomations(automationDtos);
        return getOldestAlertsAccessedOnByUser(
          '65099e0f-aa7f-447b-9fda-3181c71f93f0'
        );
      })
      .then((accessedOnByUserElements) => {
        setAlertsAccessedOnByUser(accessedOnByUserElements);
      })
      .catch((error) => {
        setAutomationError(error.message);
        setShowErrorModal(true);
      });
  };

  useEffect(renderAutomations, []);

  useEffect(() => {
    Promise.all(
      automations.map(async (automation) => ({
        id: automation.id,
        selectors: await Promise.all(
          automation.subscriptions.map(async (subscription) => {
            const selector = await SelectorApiRepository.getOne(
              subscription.selectorId
            );

            if (!selector)
              throw new Error(`Selector ${subscription.selectorId} not found`);

            return selector;
          })
        ),
      }))
    )
      .then((selectorElements) => {
        setSelectors(selectorElements);
        if (!initialRenderFinished.current)
          initialRenderFinished.current = true;
      })
      .catch((error) => {
        setAutomationError(error.message);
        setShowErrorModal(true);
      });
  }, [automations]);

  useEffect(() => {
    if (!initialRenderFinished.current) return;
    if (!showSubscriptionsModal) {
      setSubscriptionsElement(undefined);
      return;
    }
    const automation = automations.find(
      (element) => element.id === automationId
    );

    if (!automation) return;

    getSubscriptionInfo(
      automation.subscriptions,
      automationId,
      handleIsSubscribedValue
    )
      .then((subscriptionElements) => {
        const headers: string[] = subscriptionElements.length
          ? ['System', 'System-Id', 'Selector', 'Selector-Id', 'Subscribed']
          : [];
        setSubscriptionsElement(Table(headers, subscriptionElements));
      })
      .catch((error) => {
        setAutomationError(error.message);
        setShowErrorModal(true);
      });
  }, [showSubscriptionsModal]);

  useEffect(() => {
    if (
      !subscriptionsSubmit ||
      !initialRenderFinished.current ||
      !Object.keys(isSubscribedValues).length
    )
      return;

    Promise.all(
      Object.keys(isSubscribedValues).map(async (key) => {
        const value = isSubscribedValues[key];
        if (value) return false;

        const deleteSuccess = await AutomationApiRepository.deleteSubscription(
          automationId,
          new URLSearchParams({ selectorId: key })
        );

        if (!deleteSuccess)
          throw new Error(
            `Subscription of automation ${automationId} to selector ${key} could not have been deleted`
          );

        return deleteSuccess;
      })
    )
      .then((results) => {
        const numOfDeletedSubscriptions = results.filter(
          (result) => result
        ).length;
        if (!numOfDeletedSubscriptions) return;

        renderAutomations();

        setIsSubscribedValues({});
        setSubscriptionsSubmit(false);
      })
      .catch((error) => {
        setAutomationError(error.message);
        setShowErrorModal(true);
      });
  }, [subscriptionsSubmit]);

  useEffect(() => {
    if (!initialRenderFinished.current) return;

    const automation = automations.find(
      (element) => element.id === automationId
    );

    if (!automation) {
      setAutomationError(`Automation ${automationId} not found`);
      setShowErrorModal(true);
      return;
    }

    if (!showAlertsModal) {
      setMissedAlertsElement(undefined);

      updateAlertAccessedOnValues(automationId, automation.subscriptions)
        .then(() => renderAutomations())
        .catch((error) => {
          setAutomationError(error.message);
          setShowErrorModal(true);
          renderAutomations();
        });
      return;
    }

    try {
      const tableContent: string[][] = automation.subscriptions.flatMap(
        (subscription) => {
          const automationSelectors = selectors.find(
            (element) => element.id === automation.id
          );

          if (!automationSelectors || !automationSelectors.selectors.length)
            return [];

          const selector = automationSelectors.selectors.find(
            (element) => element.id === subscription.selectorId
          );

          if (!selector)
            throw new Error(
              `Selector with id ${subscription.selectorId} not found`
            );

          const oldestAlertsAccessedOnByUser = alertsAccessedOnByUser.find(
            (element) => element.selectorId === subscription.selectorId
          );

          if (!oldestAlertsAccessedOnByUser)
            throw new Error(
              `Oldest date of alert access was not found for selector ${subscription.selectorId}`
            );

          const missedAlerts = selector.alerts.filter(
            (alert) =>
              alert.createdOn >=
              oldestAlertsAccessedOnByUser.alertsAccessedOnByUser
          );

          return missedAlerts.map((alert) => [
            new Date(alert.createdOn).toISOString(),
          ]);
        }
      );

      const tableHeaders: string[] = tableContent.length ? ['Occurrence'] : [];

      setMissedAlertsElement(Table(tableHeaders, tableContent));
    } catch (error) {
      setAutomationError(error.message);
      setShowErrorModal(true);
    }
  }, [showAlertsModal]);

  useEffect(() => {
    if (!registrationSubmit || !initialRenderFinished.current) return;

    AutomationApiRepository.post(automationName, accountId)
      .then((automation) => {
        if (!automation)
          throw new Error(`Creation of automation ${automationName} failed`);

        console.log(
          `Automation ${automationName} sucessfully created under id ${automation.id}`
        );

        renderAutomations();

        setRegistrationSubmit(false);

        return Promise.resolve();
      })
      .catch((error) => {
        renderAutomations();
        setRegistrationSubmit(false);
        setAutomationError(error.message);
        setShowErrorModal(true);
      });
  }, [registrationSubmit]);

  useEffect(() => {
    if (!showRegistrationModal && initialRenderFinished.current) {
      setAccountId('');
      setAutomationName('');
    }
  }, [showRegistrationModal]);

  useEffect(() => {
    if (!toDelete || !initialRenderFinished.current) return;

    AutomationApiRepository.delete(automationId)
      .then((deleted) => {
        if (!deleted)
          throw new Error(`Deletion of automation ${automationId} failed`);

        console.log(`Selector ${automationId} sucessfully deleted`);

        renderAutomations();

        setToDelete(false);
        setShowOptionsModal(false);
      })
      .catch((error) => {
        setToDelete(false);
        setAutomationError(error.message);
        setShowErrorModal(true);
      });
  }, [toDelete]);

  useEffect(() => {
    if (!initialRenderFinished.current) return;
    if (!showAlertsOverviewModal) {
      setHeatmapElement(undefined);
      return;
    }

    const automationSelectors = selectors.find(
      (element) => element.id === automationId
    );

    if (!automationSelectors || !automationSelectors.selectors.length) {
      setHeatmapElement(Heatmap(getHeatmapData([])));
      return;
    }

    const heatmapData = getHeatmapData(automationSelectors.selectors);
    setHeatmapElement(Heatmap(heatmapData));
  }, [showAlertsOverviewModal]);

  return (
    <Automations>
      {buildRows(
        automations,
        selectors,
        alertsAccessedOnByUser,
        handleAutomationId,
        handleSubscriptionsState,
        handleAlertsState,
        handleOptionsState,
        handleAlertsOverviewState
      )}
      <FloatingButton onClick={() => setShowRegistrationModal(true)}>
        <IconAdd />
      </FloatingButton>
      {showRegistrationModal
        ? Modal(
            <form>
              <FieldLabel>Automation Name</FieldLabel>
              <Input
                type="text"
                placeholder="Enter automation name..."
                onChange={(event) => setAutomationName(event.target.value)}
                required
              />
              <FieldLabel>Account Id (Automation Owner)</FieldLabel>
              <Input
                type="text"
                placeholder="Enter account id of owner..."
                onChange={(event) => setAccountId(event.target.value)}
                required
              />
            </form>,
            'Register Automation',
            'Submit',
            handleRegistrationState,
            handleRegistrationSubmit
          )
        : null}
      {showSubscriptionsModal && subscriptionsElement
        ? Modal(
            subscriptionsElement,
            'Selector Subscriptions',
            'Submit',
            handleSubscriptionsState,
            handleSubscriptionsSubmit
          )
        : null}
      {showOptionsModal
        ? Modal(
            <Button onClick={() => setToDelete(true)}>
              Delete Automation
            </Button>,
            'Automation Options',
            '',
            handleOptionsState,
            handleOptionsState
          )
        : null}
      {showAlertsModal && missedAlertsElement
        ? Modal(
            missedAlertsElement,
            'Missed Alerts',
            'Ok',
            handleAlertsState,
            handleAlertsState
          )
        : null}
      {showAlertsOverviewModal && heatmapElement
        ? Modal(
            <HeatmapElement>{heatmapElement}</HeatmapElement>,
            'Number of Alerts per Day',
            'Ok',
            handleAlertsOverviewState,
            handleAlertsOverviewState
          )
        : null}
      {showErrorModal && automationError
        ? Modal(
            <p>{automationError}</p>,
            'An error occurred',
            'Ok',
            handleErrorState,
            handleErrorState
          )
        : null}
    </Automations>
  );
};
