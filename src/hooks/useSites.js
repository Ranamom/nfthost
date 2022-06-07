import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useWebsite } from '@/providers/WebsiteProvider'
import { useToast } from '@chakra-ui/react'
import posthog from 'posthog-js'
import axios from 'axios'
import config from '@/config/index'
import { decryptToken } from '@/utils/tools'
import { useUser } from '@/providers/UserProvider'
import { useCore } from '@/providers/CoreProvider'
import { useWeb3 } from '@/hooks/useWeb3'

export const useSites = () => {
    const toast = useToast();
    const router = useRouter();
    const { setPaymentData } = useCore();
    const { address, user } = useUser();
    const { 
        websites,
        setWebsites, 
        setIsCreating, 
        setIsRefreshing,
        newSubcription,
        setNewSubscription,
        newComponentTitle,
        setNewComponentTitle,
        newComponentImage,
        setNewComponentImage,
        newComponentDescription,
        setNewComponentDescription,
        newComponentEmbed,
        setNewComponentEmbed,
        newMetaRobot,
        setNewMetaRobot,
        newMetaFavicon,
        setNewMetaFavicon,
        newMetaLanguage,
        setNewMetaLanguage,
        newErrors,
        setNewErrors,
        setIsEditWebsite,
        setIsUpdating,
        currentEditWebsite,
        setCurrentEditWebsite,
        setIsDeletingWebsite
    } = useWebsite();
    const { DeductFree, getUserByAddress, AddCount, DeductCount } = useWeb3();

    useEffect(() => {   
        GetWebsites();
    }, [])

    const GetWebsites = async () => {
        try {
            const storageToken = localStorage.getItem('nfthost-user');
            if (!storageToken) return;
            if (!user) return;

            setIsRefreshing(true);

            const token = decryptToken(storageToken, true);

            const res = await axios.get(`${config.serverUrl}/api/website/getMany`, {
                params: {
                    memberId: user._id
                },
                headers: { 
                    Authorization: `Bearer ${token.accessToken}` 
                }
            })

            setWebsites(res.data);
            setIsRefreshing(false);
        }
        catch (err) {
            console.error(err);
            setIsRefreshing(false);
            toast({
                title: 'Error',
                description: err.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-center'
            })
        }
    }

    const pushError = (errorsObj, { component, status, message }) => {
        errorsObj[component] = {
            status,
            message
        }
    }

    const CreateWebsite = async () => {
        try {
            setNewErrors(null);

            let errorsObj = {};

            if (!newComponentTitle.length) pushError(errorsObj, { component: 'title', status: true, message: 'Title field must be filled in' });
            if (!newComponentDescription.length) pushError(errorsObj, { component: 'description', status: true, message: 'Description field must be filled in' });
            if (!newComponentEmbed.length) pushError(errorsObj, { component: 'embed', status: true, message: 'Embed field must be filled in' });

            if (Object.keys(errorsObj).length > 0) {
                setNewErrors(errorsObj);
                return;
            }

            const member = await getUserByAddress(address);

            if (!member) throw new Error('Cannot fetch member');

            if (newSubcription === 'premium' && member.services.website.freeWebsite === 0) {
                setPaymentData({
                    service: 'Website',
                    price: 15,
                    product: '1 NFT mint website (premium)',
                    redirect: {
                        origin: '/service/website',
                        title: 'Website'
                    },
                    due: new Date()
                })
                router.push('/payment', undefined, { shallow: true }); 
                return;
            }
            else if (newSubcription === 'premium' && member.services.website.freeWebsite > 0) {
                const DEDUCT_INDEX = 1;
                await DeductFree(DEDUCT_INDEX, 'website');
            }

            const storageToken = localStorage.getItem('nfthost-user');
            if (!storageToken) return;

            setIsCreating(true);

            const token = decryptToken(storageToken, true);

            const res = await axios.post(`${config.serverUrl}/api/website/create`, {
                memberId: user._id,
                isPremium: newSubcription === 'premium',
                components: {
                    title: newComponentTitle,
                    unrevealedImage: newComponentImage,
                    description: newComponentDescription,
                    embed: newComponentEmbed,
                },
                meta: {
                    robot: newMetaRobot,
                    favicon: newMetaFavicon,
                    language: newMetaLanguage
                }
            }, {
                headers: { 
                    Authorization: `Bearer ${token.accessToken}` 
                }
            })

            const INCREMENT_INDEX = 1;
            await AddCount(INCREMENT_INDEX, 'website');
            await GetWebsites();

            setIsCreating(false);

            posthog.capture('User created a mint website', {
                subscription: newSubcription
            });

            toast({
                title: 'Success',
                description: 'Successfuly created a mint website',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom-center'
            })
        }
        catch (err) {
            console.error(err);
            setIsCreating(false);
            toast({
                title: 'Error',
                description: err.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-center'
            })
        }
    }

    const EditWebsite = (websiteIdx) => {
        setNewErrors(null);
        setCurrentEditWebsite(websites[websiteIdx]);
        setIsEditWebsite(true);
        setNewSubscription(websites[websiteIdx].isPremium ? 'premium' : 'free');
        setNewComponentTitle(websites[websiteIdx].components.title);
        setNewComponentImage(websites[websiteIdx].components.unrevealedImage);
        setNewComponentDescription(websites[websiteIdx].components.description);
        setNewComponentEmbed(websites[websiteIdx].components.embed);
        setNewMetaRobot(websites[websiteIdx].meta.robot);
        setNewMetaFavicon(websites[websiteIdx].meta.favicon);
        setNewMetaLanguage(websites[websiteIdx].meta.language);
    }

    const clearFields = () => {
        setNewErrors(null);
        setCurrentEditWebsite(null);
        setIsEditWebsite(false);
        setNewSubscription('free');
        setNewComponentTitle('');
        setNewComponentImage('https://www.nfthost.app/assets/logo.png');
        setNewComponentDescription('');
        setNewComponentEmbed('');
        setNewMetaRobot('if');
        setNewMetaFavicon('https://www.nfthost.app/favicon.ico');
        setNewMetaLanguage('EN');
    }

    const UpdateWebsite = async () => {
        try {
            setNewErrors(null);

            let errorsObj = {};

            if (!newComponentTitle.length) pushError(errorsObj, { component: 'title', status: true, message: 'Title field must be filled in' });
            if (!newComponentDescription.length) pushError(errorsObj, { component: 'description', status: true, message: 'Description field must be filled in' });
            if (!newComponentEmbed.length) pushError(errorsObj, { component: 'embed', status: true, message: 'Embed field must be filled in' });

            if (Object.keys(errorsObj).length > 0) {
                setNewErrors(errorsObj);
                return;
            }

            if (!currentEditWebsite) throw new Error('Select a mint website');

            const member = await getUserByAddress(address);

            if (!member) throw new Error('Cannot fetch member');

            if (!currentEditWebsite.isPremium && newSubcription === 'premium' && member.services.website.freeWebsite === 0) {
                setPaymentData({
                    service: 'Website',
                    price: 15,
                    product: '1 NFT mint website (premium)',
                    redirect: {
                        origin: '/service/website',
                        title: 'Website'
                    },
                    due: new Date()
                })
                router.push('/payment', undefined, { shallow: true }); 
                return;
            }
            else if (!currentEditWebsite.isPremium && newSubcription === 'premium' && member.services.website.freeWebsite > 0) {
                const DEDUCT_INDEX = 1;
                await DeductFree(DEDUCT_INDEX, 'website');
            }

            const storageToken = localStorage.getItem('nfthost-user');
            if (!storageToken) return;

            setIsUpdating(true);

            const token = decryptToken(storageToken, true);

            const res = await axios.put(`${config.serverUrl}/api/website/update`, {
                websiteId: currentEditWebsite._id,
                isPremium: newSubcription === 'premium',
                components: {
                    title: newComponentTitle,
                    unrevealedImage: newComponentImage,
                    description: newComponentDescription,
                    embed: newComponentEmbed,
                },
                meta: {
                    robot: newMetaRobot,
                    favicon: newMetaFavicon,
                    language: newMetaLanguage
                }
            }, {
                headers: { 
                    Authorization: `Bearer ${token.accessToken}` 
                }
            })

            await GetWebsites();

            setIsUpdating(false);

            toast({
                title: 'Success',
                description: 'Successfuly updated your mint website',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom-center'
            })
        }
        catch (err) {
            console.error(err);
            setIsUpdating(false);
            toast({
                title: 'Error',
                description: err.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-center'
            })
        }
    }

    const DeleteWebsite = async () => {
        try {
            setNewErrors(null);

            if (!currentEditWebsite) throw new Error('Select a mint website');

            const storageToken = localStorage.getItem('nfthost-user');
            if (!storageToken) return;

            setIsDeletingWebsite(true);

            const token = decryptToken(storageToken, true);

            const res = await axios.delete(`${config.serverUrl}/api/website/delete`, {
                data: {
                    websiteId: currentEditWebsite._id
                },
                headers: { 
                    Authorization: `Bearer ${token.accessToken}` 
                }
            })

            const DEDUCT_INDEX = 1;
            await DeductCount(DEDUCT_INDEX, 'website');
            await GetWebsites();

            clearFields();

            setIsDeletingWebsite(false);

            toast({
                title: 'Success',
                description: 'Successfuly deleted your website',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom-center'
            })
        }
        catch (err) {
            console.error(err);
            setIsDeletingWebsite(false);
            toast({
                title: 'Error',
                description: err.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-center'
            })
        }
    }

    return {
        GetWebsites,
        CreateWebsite,
        EditWebsite,
        UpdateWebsite,
        clearFields,
        DeleteWebsite
    }
}