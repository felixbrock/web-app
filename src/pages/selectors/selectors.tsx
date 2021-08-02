import React, { ReactElement, useState, useEffect } from 'react';
import SelectorComponent from '../../components/selector/selector';
import {
  Selectors,
  SelectorColumn,
  SelectorRow,
  FloatingButton,
  IconAdd,
  HeatmapElement,
} from './selectors-items';
import { Input, FieldLabel } from '../../components/form/form-items';
import Modal from '../../components/modal/modal';
import Button from '../../components/button/button';
import SelectorDto from '../../infrastructure/selector-api/selector-dto';
import SelectorApiRepository from '../../infrastructure/selector-api/selector-api-repository';
import AccountApiRepository from '../../infrastructure/account-api/account-api-repository';
import SubscriptionApiRepository from '../../infrastructure/subscription-api/subscription-api-repository';
import AccountDto from '../../infrastructure/account-api/account-dto';
import SubscriptionDto from '../../infrastructure/subscription-api/subscription-dto';
import Table from '../../components/table/table';
import {
  buildDateKey,
  buildHeatmapData,
  DateData,
  generateDateDataStub,
  Heatmap,
  HeatmapData,
} from '../../components/heatmap/heatmap';
import AlertDto from '../../infrastructure/selector-api/alert-dto';
import TargetDto from '../../infrastructure/subscription-api/target-dto';

interface OldestAlertsAccessedOnByUser {
  selectorId: string;
  alertsAccessedOnByUser: number;
}

const isWhitespaceString = (text: string): boolean => !/\S/.test(text);

const getDateData = (
  startDate: Date,
  endDate: Date,
  selector: SelectorDto
): DateData => {
  const dateRegistry = generateDateDataStub(startDate, endDate);

  const relevantAlerts = selector.alerts.filter(
    (alert) =>
      alert.createdOn >= startDate.getTime() &&
      alert.createdOn <= endDate.getTime()
  );
  relevantAlerts.forEach((alert) => {
    dateRegistry[buildDateKey(new Date(alert.createdOn))] += 1;
  });

  return dateRegistry;
};

const getHeatmapData = (selector: SelectorDto | undefined): HeatmapData => {
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

  if (!selector) return { metaData: { startDate }, series: [] };

  const dateRegistry = getDateData(startDate, endDate, selector);

  const heatmapData = buildHeatmapData(startDate, endDate, dateRegistry);

  return heatmapData;
};

const getSubscribedAutomations = async (
  selectorId: string
): Promise<SubscriptionDto[]> => {
  try {
    return await SubscriptionApiRepository.getBy(
      new URLSearchParams({ targetSelectorId: selectorId })
    );
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const updateAlertAccessedOnValues = async (
  userId: string,
  selectorId: string
): Promise<TargetDto[]> => {
  try {
    const accounts: AccountDto[] =
      await AccountApiRepository.getAccountsByUserId(
        new URLSearchParams({ userId })
      );

    if (!accounts.length)
      throw new Error(`No accounts found for user ${userId}`);

    const subscriptions: SubscriptionDto[] =
      await SubscriptionApiRepository.getBy(
        new URLSearchParams({ accountId: accounts[0].id })
      );

    const updatedTargets: TargetDto[] = [];

    subscriptions.forEach(async (subscription) => {
      const target = subscription.targets.find(
        (element) => element.selectorId === selectorId
      );

      if (!target) return;

      const updatedTarget = await SubscriptionApiRepository.updateTarget(
        subscription.id,
        selectorId,
        Date.now()
      );

      if (!updatedTarget)
        throw new Error(
          `Update of target for selector ${selectorId} in context of subscription ${subscription.id} failed`
        );

      updatedTargets.push(updatedTarget);
    });

    return updatedTargets;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getOldestAlertsAccessedOnByUser = async (
  userId: string,
  selectorIds: string[]
): Promise<OldestAlertsAccessedOnByUser[]> => {
  const accessedOnByUserValues: OldestAlertsAccessedOnByUser[] = [];

  try {
    const accounts: AccountDto[] =
      await AccountApiRepository.getAccountsByUserId(
        new URLSearchParams({ userId })
      );

    if (!accounts.length)
      throw new Error(`No accounts found for user ${userId}`);

    const subscriptions: SubscriptionDto[] =
      await SubscriptionApiRepository.getBy(
        new URLSearchParams({ accountId: accounts[0].id })
      );

    subscriptions.forEach((subscription) => {
      const relevantTargets = subscription.targets.filter((target) =>
        selectorIds.includes(target.selectorId)
      );

      if (!relevantTargets.length) return;

      relevantTargets.forEach((target) => {
        const selectorAccessedOnByUser = accessedOnByUserValues.find(
          (value) => value.selectorId === target.selectorId
        );

        if (
          !selectorAccessedOnByUser ||
          selectorAccessedOnByUser.alertsAccessedOnByUser <
            target.alertsAccessedOnByUser
        )
          accessedOnByUserValues.push({
            selectorId: target.selectorId,
            alertsAccessedOnByUser: target.alertsAccessedOnByUser,
          });
      });
    });

    return accessedOnByUserValues;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getMissedAlerts = (
  selector: SelectorDto,
  oldestAlertsAccessedOnByUser: number
): AlertDto[] =>
  selector.alerts.filter(
    (alert) => alert.createdOn >= oldestAlertsAccessedOnByUser
  );

const buildRow = (cards: ReactElement[]): ReactElement => (
  <SelectorRow>{cards}</SelectorRow>
);

const buildRows = (
  selectors: SelectorDto[],
  alertsAccessedOnByUserValues: OldestAlertsAccessedOnByUser[],
  handleSelectorIdState: (systemId: string) => void,
  handleSubscribersState: (state: boolean) => void,
  handleOptionsState: (state: boolean) => void,
  handleAlertsOverviewState: (state: boolean) => void,
  handleAlertsState: (state: boolean) => void,
  handleSubscribeState: (state: boolean) => void
): ReactElement[] => {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let systemCounter = 0;

  selectors.forEach((selector) => {
    const alertAccessedOnByUser = alertsAccessedOnByUserValues.find(
      (value) => value.selectorId === selector.id
    );

    const missedAlerts = alertAccessedOnByUser
      ? selector.alerts.filter(
          (alert) =>
            alert.createdOn > alertAccessedOnByUser.alertsAccessedOnByUser
        )
      : [];

    cards.push(
      <SelectorColumn>
        {SelectorComponent(
          selector.id,
          selector.content,
          missedAlerts.length,
          handleSelectorIdState,
          handleSubscribersState,
          handleOptionsState,
          handleAlertsOverviewState,
          handleAlertsState,
          handleSubscribeState
        )}
      </SelectorColumn>
    );
    systemCounter += 1;
    if (systemCounter === 4) {
      rows.push(buildRow(cards));
      cards = [];
      systemCounter = 0;
    }
  });

  if (cards !== undefined && cards.length !== 0) {
    rows.push(buildRow(cards));
    cards = [];
  }

  return rows;
};

export default (props: any): ReactElement => {
  const { match } = props;
  const systemId = match.params.id;

  const [selectors, setSelectors] = useState<SelectorDto[]>([]);

  const [alertsAccessedOnByUser, setAlertsAccessedOnByUser] = useState<
    OldestAlertsAccessedOnByUser[]
  >([]);

  const [automations, setAutomations] = useState<ReactElement>();

  const [missedAlerts, setMissedAlerts] = useState<ReactElement>();

  const [heatmap, setHeatmap] = useState<ReactElement>();

  const [toDelete, setToDelete] = useState(false);

  const [selectorId, setSelectorId] = useState('');

  const handleSelectorIdState = (id: string): void => {
    setSelectorId(id);
  };

  const [showAlertsOverviewModal, setShowAlertsOverviewModal] = useState(false);

  const handleAlertsOverviewState = (): void =>
    setShowAlertsOverviewModal(!showAlertsOverviewModal);

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleRegistrationState = (): void =>
    setShowRegistrationModal(!showRegistrationModal);

  const [content, setContent] = useState('');

  const [registrationSubmit, setRegistrationSubmit] = useState(false);

  const handleRegistrationSubmit = (state: boolean): void => {
    if (!content || isWhitespaceString(content)) return;
    setRegistrationSubmit(state);
    setShowRegistrationModal(!showRegistrationModal);
  };

  const [showSubscribersModal, setShowSubscribersModal] = useState(false);

  const handleSubscribersState = (): void =>
    setShowSubscribersModal(!showSubscribersModal);

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleOptionsState = (): void => setShowOptionsModal(!showOptionsModal);

  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const handleAlertsState = (): void => setShowAlertsModal(!showAlertsModal);

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const [automationId, setAutomationId] = useState('');

  const handleSubscribeState = (): void =>
    setShowSubscribeModal(!showSubscribeModal);

  const [automationSubscribe, setAutomationSubscribe] = useState(false);

  const handleAutomationSubscribe = (state: boolean): void => {
    if (!automationId || isWhitespaceString(automationId)) return;
    setAutomationSubscribe(state);
    setShowSubscribeModal(!showSubscribeModal);
  };

  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleErrorState = (): void => setShowErrorModal(!showErrorModal);

  const [systemError, setSystemError] = useState('');

  const renderSelectors = () => {
    SelectorApiRepository.getBy(new URLSearchParams({ systemId }))
      .then((selectorDtos) => {
        setSelectors(selectorDtos);
        return getOldestAlertsAccessedOnByUser(
          '65099e0f-aa7f-447b-9fda-3181c71f93f0',
          selectorDtos.map((selectorDto) => selectorDto.id)
        );
      })
      .then((accessedOnByUserValues) =>
        setAlertsAccessedOnByUser(accessedOnByUserValues)
      )
      .catch((error) => {
        setSystemError(error.message);
        setShowErrorModal(true);
      });
  };

  useEffect(renderSelectors, []);

  useEffect(() => {
    if (!showSubscribersModal) {
      setAutomations(undefined);
      return;
    }

    getSubscribedAutomations(selectorId)
      .then((automationElements) => {
        const tableContent: string[][] = automationElements.map(
          (automation) => [automation.automationName, automation.id]
        );
        const tableHeaders: string[] = tableContent.length
          ? ['Name', 'Id']
          : [];

        setAutomations(Table(tableHeaders, tableContent));
      })
      .catch((error) => {
        setSystemError(error.message);
        setShowErrorModal(true);
      });
  }, [showSubscribersModal]);

  useEffect(() => {
    if (!showAlertsModal) {
      setMissedAlerts(undefined);
      updateAlertAccessedOnValues(
        '65099e0f-aa7f-447b-9fda-3181c71f93f0',
        selectorId
      )
        .then(() => renderSelectors())
        .catch((error) => {
          setSystemError(error.message);
          setShowErrorModal(true);
          renderSelectors();
        });
      return;
    }

    const selector = selectors.find((element) => element.id === selectorId);

    if (!selector) {
      setSystemError(`Selector with id ${selectorId} not found`);
      setShowErrorModal(true);
      return;
    }

    const oldestAlertsAccessedOnByUser = alertsAccessedOnByUser.find(
      (value) => value.selectorId === selectorId
    );

    if (!oldestAlertsAccessedOnByUser) {
      setSystemError(
        `Oldest date of alert access was not found for selector ${selectorId}`
      );
      setShowErrorModal(true);
      return;
    }

    const alerts = getMissedAlerts(
      selector,
      oldestAlertsAccessedOnByUser.alertsAccessedOnByUser
    );

    const tableContent: string[][] = alerts.map((alert) => [
      new Date(alert.createdOn).toISOString(),
    ]);
    const tableHeaders: string[] = tableContent.length ? ['Occurrence'] : [];

    setMissedAlerts(Table(tableHeaders, tableContent));
  }, [showAlertsModal]);

  useEffect(() => {
    if (!registrationSubmit) return;

    SelectorApiRepository.post(content, systemId)
      .then((selector) => {
        if (!selector)
          throw new Error(`Creation of selector ${content} failed`);

        console.log(
          `Selector ${content} sucessfully created under id ${selector.id}`
        );

        renderSelectors();

        setRegistrationSubmit(false);

        return Promise.resolve();
      })
      .catch((error) => {
        setRegistrationSubmit(false);
        setSystemError(error.message);
        setShowErrorModal(true);
      });
  }, [registrationSubmit]);

  useEffect(() => {
    if (!showRegistrationModal) setContent('');
  }, [showRegistrationModal]);

  useEffect(() => {
    if (!automationSubscribe) return;

    SubscriptionApiRepository.postTarget(automationId, systemId, selectorId)
      .then((target) => {
        if (!target)
          throw new Error(
            `Subscription of automation ${automationId} to selector ${selectorId} failed`
          );

        console.log(
          `Automation ${automationId} suscessfully subscribed to selector ${selectorId}`
        );

        setAutomationId('');

        setAutomationSubscribe(false);
      })
      .catch((error) => {
        setAutomationId('');
        setAutomationSubscribe(false);
        setSystemError(error.message);
        setShowErrorModal(true);
      });
  }, [automationSubscribe]);

  useEffect(() => {
    if (!showSubscribeModal) setAutomationId('');
  }, [showSubscribeModal]);

  useEffect(() => {
    if (!showErrorModal) setSystemError('');
  }, [showErrorModal]);

  useEffect(() => {
    if (!toDelete) return;

    SelectorApiRepository.delete(selectorId)
      .then((deleted) => {
        if (!deleted)
          throw new Error(`Deletion of selector ${selectorId} failed`);

        console.log(`Selector ${selectorId} sucessfully deleted`);

        renderSelectors();

        setToDelete(false);
        setShowOptionsModal(false);
      })
      .catch((error) => {
        setToDelete(false);
        setSystemError(error.message);
        setShowErrorModal(true);
      });
  }, [toDelete]);

  useEffect(() => {
    if (!showAlertsOverviewModal) {
      setHeatmap(undefined);
      return;
    }

    const selector = selectors.find((element) => element.id === selectorId);
    const heatmapData = selector
      ? getHeatmapData(selector)
      : getHeatmapData(undefined);
    setHeatmap(Heatmap(heatmapData));
  }, [showAlertsOverviewModal]);

  return (
    <Selectors>
      {buildRows(
        selectors,
        alertsAccessedOnByUser,
        handleSelectorIdState,
        handleSubscribersState,
        handleOptionsState,
        handleAlertsOverviewState,
        handleAlertsState,
        handleSubscribeState
      )}
      <FloatingButton onClick={() => setShowRegistrationModal(true)}>
        <IconAdd />
      </FloatingButton>
      {showRegistrationModal
        ? Modal(
            <form>
              <FieldLabel>Selector Content</FieldLabel>
              <Input
                type="text"
                placeholder="Enter selector content..."
                onChange={(event) => setContent(event.target.value)}
                required
              />
            </form>,
            'Register Selector',
            'Submit',
            handleRegistrationState,
            handleRegistrationSubmit
          )
        : null}
      {showSubscribersModal && automations
        ? Modal(
            automations,
            'Subscribed Automations',
            'Ok',
            handleSubscribersState,
            handleSubscribersState
          )
        : null}
      {showOptionsModal
        ? Modal(
            <Button onClick={() => setToDelete(true)}>Delete Selector</Button>,
            'Selector Options',
            '',
            handleOptionsState,
            handleOptionsState
          )
        : null}
      {showAlertsOverviewModal && heatmap
        ? Modal(
            <HeatmapElement>{heatmap}</HeatmapElement>,
            'Number of Alerts per Day',
            'Ok',
            handleAlertsOverviewState,
            handleAlertsOverviewState
          )
        : null}
      {showAlertsModal && missedAlerts
        ? Modal(
            missedAlerts,
            'Missed Alerts',
            'Ok',
            handleAlertsState,
            handleAlertsState
          )
        : null}
      {showSubscribeModal
        ? Modal(
            <form>
              <FieldLabel>Automation Id</FieldLabel>
              <Input
                type="text"
                placeholder="Enter automation id..."
                onChange={(event) => setAutomationId(event.target.value)}
                required
              />
            </form>,
            'Subscribe Automation to Selector',
            'Subscribe',
            handleSubscribeState,
            handleAutomationSubscribe
          )
        : null}
      {showErrorModal && systemError
        ? Modal(
            <p>{systemError}</p>,
            'An error occurred',
            'Ok',
            handleErrorState,
            handleErrorState
          )
        : null}
    </Selectors>
  );
};
