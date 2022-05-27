import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Text, HStack, Avatar, 
    Button, IconButton, Tag, Menu,
    MenuButton, MenuList, MenuItem,
    Image, TagRightIcon
} from '@chakra-ui/react'
import { useCore } from '@/providers/CoreProvider'
import { FaHeart, FaTiktok, FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa'
import { useNavbar } from '@/hooks/useNavbar'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { HiOutlineChevronDown, HiLogout } from 'react-icons/hi'
import { useUser } from '@/providers/UserProvider'
import { useWeb3 } from '@/hooks/useWeb3'

const Navbar = ({ isGetStarted, isSocial, isLanding, isWallet }) => {
    const router = useRouter();
    const { onTwitter, onTiktok, onDiscord, onGithub, onSponsor } = useNavbar();
    const { onConnect, onLogout } = useWeb3();
    const { setIsServiceModal } = useCore();
    const { isLoggedIn, address } = useUser();

    return (
        <nav>
            <Box 
                display='flex' 
                w='full' 
                px='2em'
                py='1.5em'
                justifyContent='center'
            >
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    w='full'
                >
                    <NextLink href='/' shallow passHref>
                        <HStack spacing='1em' cursor='pointer'>
                            <Avatar 
                                size='md'
                                src='/logo.png' 
                                name='NFT Host Logo' 
                                bg='transparent'
                            />
                            <Text fontWeight='bold' fontSize='14pt'>
                                NFT Host
                            </Text>
                        </HStack>
                    </NextLink>
                    <HStack spacing='2em'>
                        {isSocial && (
                            <HStack>
                                <IconButton 
                                    aria-label='NFT Host Twitter'
                                    icon={<FaTwitter />}
                                    borderRadius='50%'
                                    size='sm'
                                    bg='transparent'
                                    onClick={onTwitter}
                                />
                                <IconButton 
                                    aria-label='NFT Host Tiktok'
                                    icon={<FaTiktok />}
                                    borderRadius='50%'
                                    size='sm'
                                    bg='transparent'
                                    onClick={onTiktok}
                                />
                                <IconButton 
                                    aria-label='NFT Host Discord'
                                    icon={<FaDiscord />}
                                    borderRadius='50%'
                                    size='sm'
                                    bg='transparent'
                                    onClick={onDiscord}
                                />
                            </HStack>
                        )}
                        {isGetStarted && (
                            <Button onClick={() => setIsServiceModal(true)} rightIcon={<AiOutlineArrowRight />}>
                                Get Started
                            </Button>
                        )}
                        {isLanding && (
                            <NextLink href='/' shallow passHref>
                                <Button rightIcon={<AiOutlineArrowLeft />}>
                                    Landing Page
                                </Button>
                            </NextLink>
                        )}
                        {isWallet && (
                            <Menu>
                                <MenuButton as={Tag} borderWidth='1px' size='md' cursor='pointer'>
                                    {isLoggedIn ? address : 'Connect Your Wallet'}
                                    <TagRightIcon as={HiOutlineChevronDown} />
                                </MenuButton>
                                <MenuList>
                                    {isLoggedIn ? (
                                        <MenuItem icon={<HiLogout />} onClick={onLogout}>Logout</MenuItem>
                                    ) : (
                                        <>
                                        <MenuItem onClick={() => onConnect('metamask')}>
                                            <Image
                                                boxSize='2rem'
                                                borderRadius='full'
                                                src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png'
                                                alt='Metamask Wallet Logo from wikimedia.org'
                                                mr='12px'
                                            />
                                            <span>Metamask</span>
                                        </MenuItem>
                                        <MenuItem onClick={() => onConnect('phantom')}>
                                            <Image
                                                boxSize='2rem'
                                                borderRadius='full'
                                                src='https://www.yadawallets.com/wp-content/uploads/2021/06/Phantom-wallet-logo.png'
                                                alt='Phantom Wallet Logo from yadawallets.org'
                                                mr='12px'
                                            />
                                            <span>Phantom</span>
                                        </MenuItem>
                                        </>
                                    )}
                                </MenuList>
                            </Menu>
                        )}
                    </HStack>
                </Box>
            </Box>
        </nav>
    )
}

export default Navbar;