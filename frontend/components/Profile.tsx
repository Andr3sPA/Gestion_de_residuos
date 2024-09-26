import { Button, Flex, FocusLock, Heading, IconButton, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import LoginForm from "./LoginForm";
import { AiOutlineUser } from "react-icons/ai";
import { useAuth } from "@/contexts/Auth";

export default function Profile() {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const auth = useAuth()

  const popover = (<Popover
    isOpen={isOpen}
    onOpen={onOpen}
    onClose={onClose}
    placement="bottom-start"
  >
    <PopoverTrigger>
      <IconButton
        aria-label="Avatar"
        variant={"ghost"}
        colorScheme="blackAlpha"
        isRound
        size={"lg"}
        icon={<AiOutlineUser color="white" size={"2rem"} />}
      />
    </PopoverTrigger>
    <PopoverContent className="py-4" >
      <FocusLock>
        <Flex direction={"column"} align={"center"}>
          <PopoverHeader>
            <Heading size={"md"}>
              {auth.loggedIn ? auth.user.username : "Iniciar sesión"}
            </Heading>
          </PopoverHeader>
          <PopoverBody>
            {!auth.loggedIn ? <LoginForm popoverOnClose={onClose} /> : (
              <Button onClick={() => {
                auth.logout()
              }}>Cerrar sesión</Button>
            )}
          </PopoverBody>
        </Flex>
      </FocusLock>
    </PopoverContent>
  </Popover>
  )

  return popover
}
