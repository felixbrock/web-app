import React, { ReactElement } from 'react';
import { Modal, Content, Close, Submit, Title } from './modal-items';
import Button from '../button/button';

export default (
  content: ReactElement,
  title: string,
  buttonName: string,
  onChange: (state: boolean) => void
): ReactElement => {
  function close() {
    onChange(false);
  }

  return (
    <Modal>
      <Content>
        <Close>
          <Button onClick={close}>&times;</Button>
        </Close>
        <Title>{title}</Title>
        {content}
        <Submit>
          <Button onClick={close}>{buttonName}</Button>
        </Submit>
      </Content>
    </Modal>
  );
};
