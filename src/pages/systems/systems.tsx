import React, { ReactElement, useState, useEffect } from 'react';
import SystemComponent from '../../components/system/system';
import {
  Systems,
  SystemColumn,
  SystemRow,
  FloatingButton,
  IconAdd,
  HeatmapElement,
} from './systems-items';
import { Input, FieldLabel } from '../../components/form/form-items';
import Modal from '../../components/modal/modal';
import Button from '../../components/button/button';
import Table from '../../components/table/table';
import SystemDto from '../../infrastructure/system-api/system-dto';
import SystemApiRepository from '../../infrastructure/system-api/system-api-repository';
import SubscriptionApiRepository from '../../infrastructure/subscription-api/subscription-api-repository';
import AccountDto from '../../infrastructure/account-api/account-dto';
import AccountApiRepository from '../../infrastructure/account-api/account-api-repository';
import SubscriptionDto from '../../infrastructure/subscription-api/subscription-dto';
import SelectorApiRepository from '../../infrastructure/selector-api/selector-api-repository';
import SelectorDto from '../../infrastructure/selector-api/selector-dto';
import {
  buildDateKey,
  buildHeatmapData,
  buildQueryTimestamp,
  DateData,
  generateDateDataStub,
  Heatmap,
  HeatmapData,
} from '../../components/heatmap/heatmap';

interface AlertsAccessedOn {
  systemId: string;
  alertsAccessedOn: number;
}

const isWhitespaceString = (text: string): boolean => !/\S/.test(text);

const getSubscribedAutomations = async (
  systemId: string
): Promise<SubscriptionDto[]> => {
  try {
    const subscriptions: SubscriptionDto[] =
      await SubscriptionApiRepository.getBy(
        new URLSearchParams({ targetSystemId: systemId })
      );

    if (!subscriptions.length)
      throw new Error(
        `No automations that subscribe to system ${systemId} were found`
      );

    return subscriptions;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getAlertsAccessedOnValues = async (
  userId: string
): Promise<AlertsAccessedOn[]> => {
  const accessedOnValues: AlertsAccessedOn[] = [];

  try {
    const accounts: AccountDto[] =
      await AccountApiRepository.getAccountsByUserId(userId);

    if (!accounts.length)
      throw new Error(`No user-account found for user ${userId}`);

    const subscriptions: SubscriptionDto[] =
      await SubscriptionApiRepository.getBy(
        new URLSearchParams({ accountId: accounts[0].id })
      );

    if (!subscriptions.length)
      throw new Error(
        `No subscriptions were found for account ${accounts[0].id}`
      );

    subscriptions.forEach((subscription) => {
      subscription.targets.forEach((target) => {
        const systemAccessedOn = accessedOnValues.find(
          (value) => value.systemId === target.systemId
        );

        if (
          !systemAccessedOn ||
          systemAccessedOn.alertsAccessedOn < target.alertsAccessedOn
        )
          accessedOnValues.push({
            systemId: target.systemId,
            alertsAccessedOn: target.alertsAccessedOn,
          });
      });
    });

    return accessedOnValues;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getDateData = async (
  startDate: Date,
  endDate: Date,
  systemId: string
): Promise<DateData> => {
  const dateRegistry = generateDateDataStub(startDate, endDate);

  const alertCreatedOnStart = buildQueryTimestamp(startDate);
  const alertCreatedOnEnd = buildQueryTimestamp(endDate);

  const selectors: SelectorDto[] = await SelectorApiRepository.getBy(
    new URLSearchParams({ systemId, alertCreatedOnStart, alertCreatedOnEnd })
  );

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

const getHeatmapData = async (systemId: string): Promise<HeatmapData> => {
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

  try {
    const dateRegistry = await getDateData(startDate, endDate, systemId);

    const heatmapData = await buildHeatmapData(
      startDate,
      endDate,
      dateRegistry
    );

    return heatmapData;
  } catch (error) {
    console.log(error);
    return { metaData: { startDate }, series: [] };
  }
};

const getSystems = async (): Promise<SystemDto[]> => {
  try {
    return await SystemApiRepository.getAll();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const deleteSystem = async (systemId: string): Promise<boolean> => {
  try {
    return await SystemApiRepository.delete(systemId);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const createSystem = async (name: string): Promise<SystemDto | null> => {
  try {
    return await SystemApiRepository.create(name);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createSelector = async (
  content: string,
  systemId: string
): Promise<SelectorDto | null> => {
  try {
    return await SelectorApiRepository.create(content, systemId);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createRow = (cards: ReactElement[]): ReactElement => (
  <SystemRow>{cards}</SystemRow>
);

const createRows = (
  systems: SystemDto[],
  alertsAccessedOnValues: AlertsAccessedOn[],
  handleSystemIdState: (systemId: string) => void,
  handleSubscribersState: (state: boolean) => void,
  handleOptionsState: (state: boolean) => void,
  handleHeatmapState: (state: boolean) => void
): ReactElement[] => {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let systemCounter = 0;

  systems.forEach((system) => {
    const alertAccessedOn = alertsAccessedOnValues.find(
      (value) => value.systemId === system.id
    );

    const missedAlerts = alertAccessedOn
      ? system.warnings.filter(
          (warning) => warning.createdOn > alertAccessedOn.alertsAccessedOn
        )
      : [];

    cards.push(
      <SystemColumn>
        {SystemComponent(
          system.id,
          system.name,
          missedAlerts.length,
          handleSystemIdState,
          handleSubscribersState,
          handleOptionsState,
          handleHeatmapState
        )}
      </SystemColumn>
    );
    systemCounter += 1;
    if (systemCounter === 4) {
      rows.push(createRow(cards));
      cards = [];
      systemCounter = 0;
    }
  });

  if (cards !== undefined && cards.length !== 0) {
    rows.push(createRow(cards));
    cards = [];
  }

  return rows;
};

export default (): ReactElement => {
  const [systems, setSystems] = useState<SystemDto[]>([]);

  const [alertsAccessedOn, setAlertsAccessedOn] = useState<AlertsAccessedOn[]>(
    []
  );

  const [heatmap, setHeatmap] = useState<ReactElement>();

  const [showAlertOverviewModal, setShowAlertOverviewModal] = useState(false);

  const handleShowHeatmapState = (): void =>
    setShowAlertOverviewModal(!showAlertOverviewModal);

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleRegistrationState = (): void =>
    setShowRegistrationModal(!showRegistrationModal);

  const [systemName, setSystemName] = useState('');

  const [selectorContent, setSelectorContent] = useState('');

  const [registrationSubmit, setRegistrationSubmit] = useState(false);

  const handleRegistrationSubmit = (state: boolean): void => {
    if (!systemName || isWhitespaceString(systemName)) return;
    setRegistrationSubmit(state);
    setShowRegistrationModal(!showRegistrationModal);
  };

  const [systemId, setSystemId] = useState<string>('');

  const handleSystemIdState = (id: string): void => {
    setSystemId(id);
  };

  const [showSubscribersModal, setShowSubscribersModal] = useState(false);

  const handleSubscribersState = (): void =>
    setShowSubscribersModal(!showSubscribersModal);

  const [automations, setAutomations] = useState<ReactElement>();

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleOptionsState = (): void => setShowOptionsModal(!showOptionsModal);

  const [toDelete, setToDelete] = useState(false);

  const renderSystems = () => {
    const systemIds: string[] = [];

    getSystems()
      .then((systemDtos) => {
        systemDtos.forEach((dto) => systemIds.push(dto.id));
        setSystems(systemDtos);
        return getAlertsAccessedOnValues(
          '65099e0f-aa7f-447b-9fda-3181c71f93f0'
        );
      })
      .then((accessedOnValues) => setAlertsAccessedOn(accessedOnValues))
      .catch((error) => console.log(error));
  };

  useEffect(renderSystems, []);

  useEffect(() => {
    if (!showSubscribersModal) return;

    getSubscribedAutomations(systemId)
      .then((automationElements) => {
        const content: string[][] = automationElements.map((automation) => [
          automation.automationName,
          automation.id,
        ]);
        const headers: string[] = content.length ? ['Name', 'Id'] : [];

        setAutomations(Table(headers, content));
      })
      .catch((error) => console.log(error));
  }, [showSubscribersModal]);

  useEffect(() => {
    if (!registrationSubmit) return;

    createSystem(systemName)
      .then((system) => {
        if (!system)
          return Promise.reject(
            new Error(`Creation of system ${systemName} failed`)
          );

        console.log(
          `System ${systemName} sucessfully created under id ${system.id}`
        );

        if (!selectorContent || isWhitespaceString(selectorContent))
          return Promise.reject(new Error('No selector to be created'));

        setSystemName('');

        return createSelector(selectorContent, system.id);
      })
      .then((selector) => {
        const resultMessage = selector
          ? `Selector ${selectorContent} sucessfully created under id ${selector.id}`
          : `Creation of selector ${selectorContent} failed`;
        console.log(resultMessage);

        setSelectorContent('');

        renderSystems();

        setRegistrationSubmit(false);
      })
      .catch((error) => {
        console.log(error);

        renderSystems();

        setRegistrationSubmit(false);
      });
  }, [registrationSubmit]);

  useEffect(() => {
    if (!toDelete) return;

    deleteSystem(systemId)
      .then((result) => {
        if (result) {
          console.log(`System ${systemId} sucessfully deleted`);

          setShowOptionsModal(false);

          renderSystems();
        } else {
          console.log(`Deletion of system ${systemId} failed`);

          setShowOptionsModal(false);
        }

        setToDelete(false);
      })
      .catch((error) => console.log(error));
  }, [toDelete]);

  useEffect(() => {
    if (!showAlertOverviewModal) return;

    getHeatmapData(systemId).then((heatmapData) =>
      setHeatmap(Heatmap(heatmapData))
    );
  }, [showAlertOverviewModal]);

  return (
    <Systems>
      {createRows(
        systems,
        alertsAccessedOn,
        handleSystemIdState,
        handleSubscribersState,
        handleOptionsState,
        handleShowHeatmapState
      )}
      <FloatingButton onClick={() => setShowRegistrationModal(true)}>
        <IconAdd />
      </FloatingButton>
      {showRegistrationModal
        ? Modal(
            <form>
              <FieldLabel>System Name</FieldLabel>
              <Input
                type="text"
                placeholder="Enter system name..."
                onChange={(event) => setSystemName(event.target.value)}
                required
              />
              <FieldLabel>Selector Content</FieldLabel>
              <Input
                type="text"
                placeholder="[optional] Enter selector content..."
                onChange={(event) => setSelectorContent(event.target.value)}
              />
            </form>,
            'Register System',
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
            <Button onClick={() => setToDelete(true)}>Delete System</Button>,
            'System Options',
            '',
            handleOptionsState,
            handleOptionsState
          )
        : null}
      {showAlertOverviewModal && heatmap
        ? Modal(
            <HeatmapElement>{heatmap}</HeatmapElement>,
            'Number of Alerts per Day',
            'Ok',
            handleShowHeatmapState,
            handleShowHeatmapState
          )
        : null}
    </Systems>
  );
};
