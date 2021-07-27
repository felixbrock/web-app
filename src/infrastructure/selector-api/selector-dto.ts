import AlertDto from "./arlert-dto";

export default interface SelectorDto {
  id: string;
  content: string;
  systemId: string;
  modifiedOn: number;
  alerts: AlertDto[];
  // eslint-disable-next-line semi
}