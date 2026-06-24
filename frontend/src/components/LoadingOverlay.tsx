import { 
  LoadingOverlay as MantineLoadingOverlay, 
  useMantineTheme,
  useMantineColorScheme 
} from "@mantine/core";

interface Props {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: Props) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme(); // Added this hook
  
  return (
    <MantineLoadingOverlay
      visible={visible}
      zIndex={1000}
      loaderProps={{ type: 'dots', color: theme.colors.blue[6], size: 'xl' }}
      overlayProps={{
        radius: "sm",
        blur: 3,
        // Replaced theme.colorScheme with the colorScheme variable from the hook
        color: colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.7
      }}
    />
  );
}