import {
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";

import {
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";

import {
  useEffect,
} from "react";

export default function ThemeToggle() {

  const {
    colorScheme,
    setColorScheme,
  } =
    useMantineColorScheme();

  const toggleTheme =
    () => {

      const nextTheme =
        colorScheme === "dark"
          ? "light"
          : "dark";

      setColorScheme(
        nextTheme
      );

      localStorage.setItem(
        "qa-theme",
        nextTheme
      );
    };

  useEffect(() => {

    const handleKeyDown =
      (
        event: KeyboardEvent
      ) => {

        if (
          event.ctrlKey &&
          event.key.toLowerCase() === "j"
        ) {

          event.preventDefault();

          toggleTheme();
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    colorScheme
  ]);

  return (

    <Tooltip
      label="Toggle Theme (Ctrl + J)"
      withArrow
    >

      <ActionIcon
        variant="light"
        radius="md"
        size="lg"
        onClick={
          toggleTheme
        }
      >

        {

          colorScheme === "dark"

            ? (
              <IconSun
                size={18}
              />
            )

            : (
              <IconMoonStars
                size={18}
              />
            )

        }

      </ActionIcon>

    </Tooltip>

  );
}