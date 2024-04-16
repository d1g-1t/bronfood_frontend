import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ProgressBar1 from '../ProgressBar/ProgressBar';
import styles from './OrderTimeCounter.module.scss';

type OrderTimeCounterProps = {
    remainingTime: number;
    initialTime: number;
};

const OrderTimeCounter: FC<OrderTimeCounterProps> = ({ remainingTime, initialTime }) => {
    const { t } = useTranslation();

    const sign = remainingTime < 0 ? '-' : '';
    const formattedTime = `${sign}${Math.abs(remainingTime)}`;

    const getStatusMessage = remainingTime > 0 ? 'components.orderTimeCounter.yourOrderIsAlreadyBeingPrepared' : remainingTime === 0 ? 'components.orderTimeCounter.yourOrderIsReady' : 'components.orderTimeCounter.yourOrderWillBeReadySoon';

    const containerStyle = {
        container: remainingTime <= -1 ? styles.orderTimeCounterExpiredBorder : styles.orderTimeCounter,
        number: remainingTime <= -1 ? styles.timeExpired : '',
        image: remainingTime <= -1 ? styles.imageExpired : '',
    };

    return (
        <div className={containerStyle.container}>
            <div className={styles.orderTimeCounter__container}>
                <div className={styles.orderTimeCounter__time}>
                    <span className={`${styles.orderTimeCounter__image} ${containerStyle.image}`} />
                    <p className={`${styles.orderTimeCounter__time_number} ${containerStyle.number}`}>
                        {formattedTime}
                        {t('components.orderTimeCounter.minutes')}
                    </p>
                </div>
                <div className={styles.orderTimeCounter__separator}>
                    <ProgressBar1 initialTime={initialTime} currentTime={remainingTime} />
                </div>
                <p className={styles.orderTimeCounter__subtitle}>{t(getStatusMessage)}</p>
            </div>
        </div>
    );
};

export default OrderTimeCounter;