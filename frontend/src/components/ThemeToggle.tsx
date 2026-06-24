import { ActionIcon, Tooltip, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "j") {
        event.preventDefault();
        toggleColorScheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleColorScheme]);

  return (
    <Tooltip label={`Switch to ${dark ? 'light' : 'dark'} mode (Ctrl+J)`} withArrow>
      <ActionIcon
        variant="default"
        radius="md"
        size="lg"
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
        style={{ transition: 'background-color 0.2s ease' }}
      >
        {dark ? <IconSun size={18} color="var(--mantine-color-yellow-4)" /> : <IconMoonStars size={18} color="var(--mantine-color-blue-6)" />}
      </ActionIcon>
    </Tooltip>
  );
}