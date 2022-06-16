import { useState, useContext, createContext } from 'react'

export const CoreContext = createContext({})
export const useCore = () => useContext(CoreContext)

export const CoreProvider = ({ children }) => {
    const [isServiceModal, setIsServiceModal] = useState(false);
    const [isCookieModal, setIsCookieModal] = useState(false);
    const [isKeepWorkingModal, setIsKeepWorkingModal] = useState(false);
    const [isSidebar, setIsSidebar] = useState(true);
    const [paymentData, setPaymentData] = useState({
        service: 'Generator',
        price: 25,
        product: '1 NFT collection generation',
        redirect: {
            origin: '/service/generator',
            title: 'Generator'
        },
        due: new Date()
    });
    const [paymentMethodStep, setPaymentMethodStep] = useState('metamask');
    const [paymentName, setPaymentName] = useState('');
    const [paymentEmail, setPaymentEmail] = useState('');
    const [paymentAddress, setPaymentAddress] = useState('');
    const [paymentCity, setPaymentCity] = useState('');
    const [paymentState, setPaymentState] = useState('');
    const [paymentZip, setPaymentZip] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    const controllers = {
        isServiceModal,
        setIsServiceModal,
        isCookieModal,
        setIsCookieModal,
        isSidebar,
        setIsSidebar,
        paymentData,
        setPaymentData,
        paymentMethodStep,
        setPaymentMethodStep,
        paymentName,
        setPaymentName,
        paymentEmail,
        setPaymentEmail,
        paymentAddress,
        setPaymentAddress,
        paymentCity,
        setPaymentCity,
        paymentState,
        setPaymentState,
        paymentZip,
        setPaymentZip,
        isPaying,
        setIsPaying,
        isKeepWorkingModal,
        setIsKeepWorkingModal
    }

    return (
		<CoreContext.Provider
			value={controllers}
		>
			{ children }
		</CoreContext.Provider>
	)
}