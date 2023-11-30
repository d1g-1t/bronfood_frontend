import { FC } from 'react';
import styles from './Input.module.scss';
import { useId } from 'react';

interface Input {
    /**
     * HTML type for the input
     */
    type: string;
    /**
     * Title for input
     */
    nameLabel: string;
    /**
     * Placeholder for input
     */
    placeholder: string;
    /**
     * Name of input
     */
    name: string;
}

const Input: FC<Input> = (props) => {
    const id = useId();
    return (
        <div className={styles.input}>
            <label htmlFor={id} className={styles.input__label}>
                {props.nameLabel}
            </label>
            <input id={id} className={styles.input__place} type={props.type} placeholder={props.placeholder} name={props.name}></input>
        </div>
    );
};

export default Input;