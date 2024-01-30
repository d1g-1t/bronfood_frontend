import { FC, useState } from 'react';
import styles from './InputPassword.module.scss';
import { useId } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { regexPassword } from '../../utils/consts';
import { useTranslation } from 'react-i18next';
import HidePasswordIcon from '../../vendor/images/icons/hide-password-icon.svg?react';
import ShowPasswordIcon from '../../vendor/images/icons/show-password-icon.svg?react';

interface InputPassword {
    /**
     * Name of input
     */
    name: string;
    /**
     * Input label
     */
    nameLabel: string;
    /**
     * Placeholder for input
     */
    register: UseFormRegister<FieldValues>;
    /**
     * React Hook Forms error object
     */
    errors: FieldErrors;
    /**
     * Custom validation function
     */
    validate?: (value: FieldValues) => string | boolean;
}

const InputPassword: FC<InputPassword> = (props) => {
    const { t } = useTranslation();
    const errorMessage = (props.errors[props.name]?.message as string) || undefined;
    const id = useId();
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const visibilityIcon = isPasswordVisible ? <HidePasswordIcon className={styles.input__hideIcon} onClick={togglePasswordVisibility} /> : <ShowPasswordIcon className={styles.input__hideIcon} onClick={togglePasswordVisibility} />;

    return (
        <div className={styles.input}>
            <label htmlFor={id} className={`${styles.input__label} ${errorMessage ? styles.input__label__error : ''}`}>
                {props.nameLabel}
            </label>
            <input
                id={id}
                className={styles.input__place}
                type={isPasswordVisible ? 'password' : 'text'}
                placeholder={isPasswordVisible ? '******' : '123456'}
                {...props.register(props.name, {
                    required: t('components.inputPassword.required'),
                    pattern: {
                        value: regexPassword,
                        message: t('components.inputPassword.errorMessage'),
                    },
                    validate: props.validate,
                })}
                autoComplete="off"
            ></input>
            {visibilityIcon}
            {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
        </div>
    );
};

export default InputPassword;
