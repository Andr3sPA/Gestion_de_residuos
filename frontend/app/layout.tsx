'use client'

import "./globals.css";
import { Providers } from "./providers";
import { Avatar, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, Icon, IconButton, Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Spacer, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import React from "react";
import LoginForm from "@/components/LoginForm";
import Profile from "@/components/Profile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const menuBtnRef = React.useRef(null)

  return (
    <html lang="en">
      <body className="h-screen">
        <Providers>
          <Flex className="bg-cyan-600 p-2">
            <IconButton
              ref={menuBtnRef}
              onClick={onOpen}
              aria-label="Menu"
              size={"lg"}
              variant={"ghost"}
              fontSize={"2rem"}
              colorScheme="blackAlpha"
              icon={<HamburgerIcon color={"white"} />}
            />
            <Spacer />
            <Profile />
          </Flex>
          <Drawer
            isOpen={isOpen}
            onClose={onClose}
            finalFocusRef={menuBtnRef}
            placement="left"
          >
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader className="text-cyan-600">
                  Menu
                </DrawerHeader>
                <Divider></Divider>
                <DrawerBody>
                  list of smthg
                </DrawerBody>
                <DrawerFooter>
                  ~links
                </DrawerFooter>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
          <Flex direction={"column"} className="h-full place-content-center">
            {children}
          </Flex>
        </Providers>
      </body>
    </html >
  );
}
