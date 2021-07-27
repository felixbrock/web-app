import TargetDto from './target-dto';

export default interface SubscriptionDto {
  id: string;
  automationName: string;
  accountId: string;
  targets: TargetDto[];
  modifiedOn: number;
  // eslint-disable-next-line semi
}
