import Popup from '../../../components/Popups/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import { Form, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import FormInputs from '../../../components/FormInputs/FormInputs';
import InputPassword from '../../../components/InputPassword/InputPassword';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import Button from '../../../components/Button/Button';

interface NewPassword {
    /**
     * Submit form action
     */
    onSubmit: (password: string, password_confirm: string) => void;
}

const NewPassword: FC<NewPassword> = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        control,
        watch,
    } = useForm();

    const onSubmit: SubmitHandler<FieldValues> = (formFields) => {
        const { password, password_confirm } = formFields.data;
        props.onSubmit(password, password_confirm);
    };

    const validatePasswords = (value: FieldValues): string | boolean => {
        if (watch('password') != value) {
            return t('pages.newPassword.passwordDontMatch');
        }
        return true;
    };

    return (
        <Popup
            title={t('pages.newPassword.title')}
            onClose={() => {
                navigate('/');
            }}
        >
            <Form control={control} name="form-restore-password" onSubmit={onSubmit}>
                <FormInputs>
                    <InputPassword register={register} errors={errors} name="password" nameLabel={t('pages.newPassword.nameLabel')} />
                    <InputPassword register={register} errors={errors} name="password_confirm" nameLabel={t('pages.newPassword.nameLabelRepeat')} validate={validatePasswords} />
                    <Button>{t('pages.newPassword.button')}</Button>
                </FormInputs>
            </Form>
        </Popup>
    );
};

export default NewPassword;
