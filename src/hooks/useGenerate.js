import { useGenerator } from '@/providers/GeneratorProvider'
import { useToast } from '@chakra-ui/react'

export const useGenerate = () => {
    const toast = useToast();
    const { 
        
    } = useGenerator();

    const onOpen = (type = 'computer') => {
        try {

        }
        catch (err) {
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

    const onSave = (type = 'computer') => {
        try {

        }
        catch (err) {
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
        onOpen,
        onSave,
    }
}