import NextLink from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Text, Slide, useColorModeValue, VStack,
    Flex, HStack, Avatar, IconButton, Button
} from '@chakra-ui/react'
import ConnectWalletTag from './ConnectWalletTag'
import { GiHamburgerMenu, GiPowerGenerator } from 'react-icons/gi'
import { MdOutlineDashboard, MdOutlineMiscellaneousServices, MdChevronRight } from 'react-icons/md'
import { BsStar } from 'react-icons/bs'
import { CgWebsite } from 'react-icons/cg'
import { useCore } from '@/providers/CoreProvider'

const sidebarItemArr = [
    { 
        parent: 'navigation',
        items: [ 
            { 
                name: 'Get Started', 
                link: '/getStarted', 
                icon: <MdOutlineDashboard />, 
                children: [] 
            } 
        ]
    },
    { 
        parent: 'apps',
        items: [ 
            { 
                name: 'Generator', 
                link: '/generator', 
                icon: <MdOutlineMiscellaneousServices />, 
                children: [] 
            },
            { 
                name: 'Website', 
                link: '/website', 
                icon: <CgWebsite />, 
                children: [
                    { name: 'Templates', link: '/website/templates' },
                    { name: 'Addons', link: '/website/addons' }
                ] 
            }
        ]
    },
]

const Layout = ({ children }) => {
    const router = useRouter();
    const { isSidebar, setIsSidebar } = useCore();

    const sidebarColor = useColorModeValue('white', 'whiteAlpha.500');
    const sidebarNavColor = useColorModeValue('#60677d', 'white');
    const toolbarColor = useColorModeValue('rgb(52,140,212)', 'whiteAlpha.600');
    const toolbarNavColor = useColorModeValue('rgba(255,255,255,.8)', 'white');
    const logoColor = useColorModeValue('white', 'white');
    const { page } = router.query

    //https://coderthemes.com/codefox/layouts/index.html

    return (
        <>
            <Slide direction='top' in={true}>
                <HStack 
                    bg={toolbarColor}
                    h='70px'
                    px='2em'
                    justifyContent='space-between'
                >
                    <HStack spacing='2em'>
                        <NextLink href='/' shallow passHref>
                            <HStack spacing='1em' cursor='pointer' p='1em'>
                                <Avatar 
                                    size='sm'
                                    src='/assets/logo.png' 
                                    name='NFT Host Logo' 
                                    bg='transparent'
                                    cursor='pointer'
                                />
                                <Text  fontSize='14pt' cursor='pointer' color={logoColor}>
                                    NFT Host
                                </Text>
                            </HStack>
                        </NextLink>
                        <IconButton 
                            bg='transparent' 
                            color={logoColor} 
                            fontSize='16pt' 
                            _hover={{ bg: 'transparent', color: toolbarNavColor }}
                            onClick={() => setIsSidebar(!isSidebar)}
                        >
                            <GiHamburgerMenu />
                        </IconButton>
                    </HStack>
                    <ConnectWalletTag />
                </HStack>
            </Slide>
            {isSidebar && (
                <Slide direction='left' in={true}>
                    <VStack
                        position='fixed'
                        top='0'
                        flexDir='column'
                        bg={sidebarColor}
                        w='245px'
                        h='full'
                        p='1.5em'
                        alignItems='flex-start'
                        mt='70px'
                        boxShadow='md'
                        spacing='1em'
                        color={sidebarNavColor}
                    >
                        {sidebarItemArr?.map((item, idx) => (
                            <VStack key={idx} spacing='1.5em' alignItems='flex-start' w='full'>
                                <Text fontSize='10pt'>
                                    {item.parent.toUpperCase()}
                                </Text>
                                <VStack spacing='.25em'>
                                    {item.items.map((nav, idx) => (
                                        <>
                                        <NextLink href={`/dashboard${nav.link}`} shallow passHref key={idx}>
                                            <Button 
                                                borderRadius='0' 
                                                leftIcon={nav.icon}
                                                w='full' 
                                                justifyContent='flex-start' 
                                                bg='transparent'
                                                _hover={{ bg: 'transparent', color: 'rgb(52,140,212)' }}
                                            >
                                                {nav.name}
                                            </Button>
                                        </NextLink>
                                        <VStack spacing='0' pl='1.5em'>
                                            {nav.children.map((children, idx) => (
                                                <NextLink href={`/dashboard${children.link}`} shallow passHref key={idx}>
                                                    <Button 
                                                        borderRadius='0' 
                                                        w='full' 
                                                        justifyContent='flex-start' 
                                                        bg='transparent'
                                                        _hover={{ bg: 'transparent', color: 'rgb(52,140,212)' }}
                                                        fontSize='10pt'
                                                    >
                                                        {children.name}
                                                    </Button>
                                                </NextLink>
                                            ))}
                                        </VStack>
                                        </>
                                    ))}
                                </VStack>
                            </VStack>
                        ))}
                    </VStack>
                </Slide>
            )}
            <Box mt='70px' ml='245px' p='2rem'>
                <Flex justifyContent='space-between'>
                    <Text fontWeight='bold'>
                        {page === 'getStarted' ? 'GET STARTED' : page?.toUpperCase()}
                    </Text>
                </Flex>
                {children}
            </Box>
        </>
    )
}

export default Layout