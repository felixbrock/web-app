import React, { ReactElement, useState, useEffect, useRef } from 'react';
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
import AutomationApiRepository from '../../infrastructure/automation-api/automation-api-repository';
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
import WarningDto from '../../infrastructure/system-api/warning-dto';

interface OldestAlertsAccessedOnByUser {
  systemId: string;
  selectorId: string;
  alertsAccessedOnByUser: number;
}

const isWhitespaceString = (text: string): boolean => !/\S/.test(text);

export const buildQueryTimestamp = (date: Date): string => {
  const dateYear = date.getUTCFullYear();
  const dateMonth =
    date.getUTCMonth() < 10
      ? `0${(date.getUTCMonth() + 1).toString()}`
      : date.getUTCMonth().toString();
  const dateDate =
    date.getUTCDate() < 10
      ? `0${date.getUTCDate().toString()}`
      : date.getUTCDate().toString();
  const dateHour =
    date.getUTCHours() < 10
      ? `0${date.getUTCHours().toString()}`
      : date.getUTCHours().toString();
  const dateMinutes =
    date.getUTCMinutes() < 10
      ? `0${date.getUTCMinutes().toString()}`
      : date.getUTCMinutes().toString();
  const dateSeconds =
    date.getUTCSeconds() < 10
      ? `0${date.getUTCSeconds().toString()}`
      : date.getUTCSeconds().toString();

  return `${dateYear}${dateMonth}${dateDate}T${dateHour}${dateMinutes}${dateSeconds}Z`;
};

const getDateData = async (
  startDate: Date,
  endDate: Date,
  systemId: string
): Promise<DateData> => {
  const dateRegistry = generateDateDataStub(startDate, endDate);

  const alertCreatedOnStart = buildQueryTimestamp(startDate);
  const alertCreatedOnEnd = buildQueryTimestamp(endDate);

  try {
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
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
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

    const heatmapData = buildHeatmapData(startDate, endDate, dateRegistry);

    return heatmapData;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getOldestAlertsAccessedOnByUser = async (
  userId: string
): Promise<OldestAlertsAccessedOnByUser[]> => {
  const accessedOnByUserValues: OldestAlertsAccessedOnByUser[] = [];

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
        const selectorAccessedOnByUser = accessedOnByUserValues.find(
          (value) => value.selectorId === subscription.selectorId
        );

        if (!selectorAccessedOnByUser)
          accessedOnByUserValues.push({
            systemId: subscription.systemId,
            selectorId: subscription.selectorId,
            alertsAccessedOnByUser: subscription.alertsAccessedOnByUser,
          });
        else if (
          subscription.alertsAccessedOnByUser <
          selectorAccessedOnByUser.alertsAccessedOnByUser
        ) {
          const index = accessedOnByUserValues.findIndex(
            (element) => element.selectorId === subscription.selectorId
          );
          accessedOnByUserValues[index] = {
            systemId: subscription.systemId,
            selectorId: subscription.selectorId,
            alertsAccessedOnByUser: subscription.alertsAccessedOnByUser,
          };
        }
      });
    });
    
    return accessedOnByUserValues;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const buildRow = (cards: ReactElement[]): ReactElement => (
  <SystemRow>{cards}</SystemRow>
);

const buildRows = (
  systems: SystemDto[],
  alertsAccessedOnByUserValues: OldestAlertsAccessedOnByUser[],
  handleSystemId: (systemId: string) => void,
  handleSubscribersState: (state: boolean) => void,
  handleOptionsState: (state: boolean) => void,
  handleAlertsOverviewState: (state: boolean) => void
): ReactElement[] => {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let systemCounter = 0;

  systems.forEach((system) => {
    const systemAccessedOnElements: OldestAlertsAccessedOnByUser[] =
      alertsAccessedOnByUserValues.filter(
        (value) => value.systemId === system.id
      );

    const missedWarnings: WarningDto[] = systemAccessedOnElements.flatMap(
      (value) => {
        const warnings = system.warnings.filter(
          (warning) =>
            warning.createdOn > value.alertsAccessedOnByUser &&
            warning.selectorId === value.selectorId
        );

        return warnings;
      }
    );

    cards.push(
      <SystemColumn>
        {SystemComponent(
          system.id,
          system.name,
          missedWarnings.length,
          handleSystemId,
          handleSubscribersState,
          handleOptionsState,
          handleAlertsOverviewState
        )}
      </SystemColumn>
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

export default (): ReactElement => {
  const initialRenderFinished = useRef(false);

  const [systems, setSystems] = useState<SystemDto[]>([]);

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

  const [systemName, setSystemName] = useState('');

  const [selectorContent, setSelectorContent] = useState('');

  const [registrationSubmit, setRegistrationSubmit] = useState(false);

  const handleRegistrationSubmit = (state: boolean): void => {
    if (!systemName || isWhitespaceString(systemName)) return;
    setRegistrationSubmit(state);
    setShowRegistrationModal(!showRegistrationModal);
  };

  const [systemId, setSystemId] = useState<string>('');

  const handleSystemId = (id: string): void => {
    setSystemId(id);
  };

  const [showSubscribersModal, setShowSubscribersModal] = useState(false);

  const handleSubscribersState = (): void =>
    setShowSubscribersModal(!showSubscribersModal);

  const [automationsElement, setAutomationsElement] = useState<ReactElement>();

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleOptionsState = (): void => setShowOptionsModal(!showOptionsModal);

  const [toDelete, setToDelete] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleErrorState = (): void => setShowErrorModal(!showErrorModal);

  const [systemError, setSystemError] = useState('');

  const renderSystems = () => {
    SystemApiRepository.getAll()
      .then((systemDtos) => {
        setSystems(systemDtos);
        return getOldestAlertsAccessedOnByUser(
          '65099e0f-aa7f-447b-9fda-3181c71f93f0'
        );
      })
      .then((accessedOnByUserValues) => {
        setAlertsAccessedOnByUser(accessedOnByUserValues);
        if (!initialRenderFinished.current)
          initialRenderFinished.current = true;
      })
      .catch((error) => {
        setSystemError(error.message);
        setShowErrorModal(true);
      });
  };

  useEffect(renderSystems, []);

  useEffect(() => {
    if (!initialRenderFinished.current) return;
    if (!showSubscribersModal) {
      setAutomationsElement(undefined);
      return;
    }

    AutomationApiRepository.getBy(
      new URLSearchParams({ subscriptionSystemId: systemId })
    )
      .then((automationElements) => {
        const content: string[][] = automationElements.map((automation) => [
          automation.name,
          automation.id,
        ]);
        const headers: string[] = content.length ? ['Name', 'Id'] : [];

        setAutomationsElement(Table(headers, content));
      })
      .catch((error) => {
        setSystemError(error.message);
        setShowErrorModal(true);
      });
  }, [showSubscribersModal]);

  useEffect(() => {
    if (!registrationSubmit || !initialRenderFinished.current) return;

    SystemApiRepository.post(systemName)
      .then((system) => {
        if (!system) throw new Error(`Creation of system ${systemName} failed`);

        console.log(
          `System ${systemName} sucessfully created under id ${system.id}`
        );

        // TODO - This seems like a workaround. Need to be fixed
        if (!selectorContent || isWhitespaceString(selectorContent))
          throw new Error('');

        return SelectorApiRepository.post(selectorContent, system.id);
      })
      .then((selector) => {
        if (!selector)
          throw new Error(`Creation of selector ${selectorContent} failed`);

        console.log(
          `Selector ${selectorContent} sucessfully created under id ${selector.id}`
        );

        renderSystems();

        setRegistrationSubmit(false);
      })
      .catch((error) => {
        renderSystems();
        setRegistrationSubmit(false);

        if (!error.message) return;

        setSystemError(error.message);
        setShowErrorModal(true);
      });
  }, [registrationSubmit]);

  useEffect(() => {
    if (!showRegistrationModal && initialRenderFinished.current) {
      setSelectorContent('');
      setSystemName('');
    }
  }, [showRegistrationModal]);

  useEffect(() => {
    if (!toDelete || !initialRenderFinished.current) return;

    SystemApiRepository.delete(systemId)
      .then((deleted) => {
        if (!deleted) throw new Error(`Deletion of system ${systemId} failed`);

        console.log(`Selector ${systemId} sucessfully deleted`);

        renderSystems();

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
    if (!initialRenderFinished.current) return;
    if (!showAlertsOverviewModal) {
      setHeatmapElement(undefined);
      return;
    }

    getHeatmapData(systemId)
      .then((heatmapData) => setHeatmapElement(Heatmap(heatmapData)))
      .catch((error) => {
        setSystemError(error.message);
        setShowErrorModal(true);
      });
  }, [showAlertsOverviewModal]);

  return (
    <Systems>
      {buildRows(
        systems,
        alertsAccessedOnByUser,
        handleSystemId,
        handleSubscribersState,
        handleOptionsState,
        handleAlertsOverviewState
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
      {showSubscribersModal && automationsElement
        ? Modal(
            automationsElement,
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
      {showAlertsOverviewModal && heatmapElement
        ? Modal(
            <HeatmapElement>{heatmapElement}</HeatmapElement>,
            'Number of Alerts per Day',
            'Ok',
            handleAlertsOverviewState,
            handleAlertsOverviewState
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
    </Systems>
  );
};
