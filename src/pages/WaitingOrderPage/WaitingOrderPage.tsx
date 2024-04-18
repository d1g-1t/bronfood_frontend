import WaitingOrder from '../WaitingOrder/WaitingOrder';
import { OrderProvider } from '../../contexts/OrderContext';

const WaitingOrderPage = () => {
    return (
        <>
            <OrderProvider clientId="clientId1">
                <WaitingOrder />
            </OrderProvider>
        </>
    );
};

export default WaitingOrderPage;