import { useTranslation } from 'react-i18next';
import Popup from '../Popups/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import styles from './SMSVerify.module.scss';
import Button from '../Button/Button';
import { PinInput } from 'react-input-pin-code';
import { FC, useState } from 'react';
import { Form, useForm } from 'react-hook-form';

interface SMSVerify {
    /**
     * Is called when the user submits the code.
     */
    onSubmit: (code: string) => void;
}

const SMSVerify: FC<SMSVerify> = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { control } = useForm();

    const [showError, setShowError] = useState<boolean>(false);
    const [values, setValues] = useState<string[]>(['', '', '', '']);

    const handleChange = (_value: string | string[], _index: number, values: string[]) => {
        setShowError(false);
        setValues(values);
    };

    const onSubmit = () => {
        const code = values.join('');
        if (code.length == 4) {
            props.onSubmit(code);
        } else {
            setShowError(true);
        }
    };

    const valTest = ['[0-9]'];
    return (
        <Popup
            title={t('pages.confirmation.enterSmsCode')}
            onClose={() => {
                navigate('/');
            }}
        >
            <div className={styles.sms_verify__layout}>
                <Form control={control} name="form-confirmation" onSubmit={onSubmit}>
                    <PinInput values={values} name="PinInput" placeholder="" required={true} containerClassName={styles.sms_verify__inputs} showState={showError} autoFocus={true} onChange={handleChange} validate={valTest} />
                    <Button>{t('components.button.next')}</Button>
                </Form>
            </div>
        </Popup>
    );
};
export default SMSVerify;
