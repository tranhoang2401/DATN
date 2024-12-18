"use client";

import { useState, useEffect } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  TextInput,
  Tooltip,
  rem,
  useMantineColorScheme,
  useMantineTheme
} from "@mantine/core";
import {
  IconChevronDown,
  IconCircleHalf2,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
  IconUserCircle,
  IconUserCode
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Logo from "./Logo"; // Placeholder cho logo
import classes from "./HeaderNav.module.css"; // CSS class tự tạo
import { useTranslation } from "react-i18next";
import LetterAvatar from "../common/LetterAvatar";
import { useAuthStore } from "../auth/AuthContext";
import { SignOut } from "@/utils/auth-helpers/server";
import LanguagePicker from "./LanguagePicker";

const ICON_SIZE = 22;

export default function HeaderNav() {
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const router = useRouter();
  const { t } = useTranslation("system");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // const authUser = useAuthStore()((s) => s.authUser);
  // const reset = useAuthStore()((s) => s.reset);
  // const name = authUser?.user_metadata?.name || authUser?.email;

  // Responsive xử lý qua `window.innerWidth`
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 430);
      setIsTablet(width > 430 && width <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignout = async () => {
    try {
      const redirectPath = await SignOut("/auth/signin", true);
      return router.push(redirectPath);
    } catch (error) {
    } finally {
      // reset();
    }
  };

  const links = [
    { label: "Quản lí trường", href: "/hosotruong" },
    { label: "Quản lí tài khoản", href: "/quanliuser" }
  ];

  return (
    <header className={classes.header}>
      <Group justify="space-between">
        {/* Logo */}
        <Logo width={140} height={40} className={classes.logo} visibleFrom="md" />

        {/* Links */}
        <Group gap={5} visibleFrom="lg" className={`${classes.links} ${isMobile ? classes.hide : ""}`}>
          {links.map((link) => (
            <Button key={link.label} component="a" href={link.href} variant="subtle">
              {link.label}
            </Button>
          ))}
        </Group>

        {/* Search bar */}
        <Group>
          <ActionIcon visibleFrom="md" hiddenFrom="xl">
            <IconSearch size={ICON_SIZE} />
          </ActionIcon>
          <TextInput
            visibleFrom="xl"
            variant="filled"
            radius="xl"
            placeholder={t("header.search")}
            rightSection={<IconSearch size={ICON_SIZE} />}
          />

          {!isMobile && (
            <>
              <LanguagePicker type="collapsed" />
              {/* <Menu shadow="lg" width={320}>
              <Menu.Target>
                <Indicator processing size={10} offset={6} color="orange">
                  <Tooltip label={t("header.messages")}>
                    <ActionIcon size="lg" color="gray" title={t("header.messages")}>
                      <IconMessageCircle size={ICON_SIZE} />
                    </ActionIcon>
                  </Tooltip>
                </Indicator>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label tt="uppercase" ta="center" fw={600}>
                  {t("header.newMessages", { count: MESSAGES.length })}
                </Menu.Label>
                {messages}
                <Menu.Item tt="uppercase" ta="center" fw={600} mt={4}>
                  {t("header.showAllMessages")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu> */}
            </>
          )}
        </Group>

        {/* Menu */}
        <Menu shadow="lg" width={200} trigger="click-hover" withArrow>
          <Menu.Target>
            <Button
              variant="subtle"
              leftSection={<IconUserCircle size={ICON_SIZE} />}
              rightSection={<IconChevronDown size={ICON_SIZE} />}>
              Tài khoản
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {t("header.welcome")}
            </Menu.Label>
            <Menu.Item component="a" leftSection={<IconUserCode size={16} />}>
              {t("header.account")}
            </Menu.Item>
            <Menu.Item component="a" leftSection={<IconUserCircle size={16} />}>
              {t("header.profile")}
            </Menu.Item>
            {/* <Menu.Item component="a" leftSection={<IconSettings size={16} />} href={SYSTEM_PATHS.settings}>
              {t("header.settings")}
            </Menu.Item> */}
            <Menu.Divider />
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {t("colorScheme.select")}
            </Menu.Label>
            <Menu.Item leftSection={<IconSunHigh size={16} />} onClick={() => setColorScheme("light")}>
              {t("colorScheme.light")}
            </Menu.Item>
            <Menu.Item leftSection={<IconMoonStars size={16} />} onClick={() => setColorScheme("dark")}>
              {t("colorScheme.dark")}
            </Menu.Item>
            <Menu.Item leftSection={<IconCircleHalf2 size={16} />} onClick={() => setColorScheme("auto")}>
              {t("colorScheme.system")}
            </Menu.Item>
            <Menu.Divider />
            {/* <Menu.Item leftSection={<IconLockAccess size={16} />}>{t("header.lockScreen")}</Menu.Item> */}
            <Menu.Item leftSection={<IconPower size={16} />} onClick={handleSignout}>
              {t("header.signout")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </header>
  );
}
