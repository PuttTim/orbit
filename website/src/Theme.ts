import { MantineThemeOverride } from "@mantine/core"

const theme: MantineThemeOverride = {
	fontFamily: "Orbitron, sans-serif",
	colorScheme: "dark",
	colors: {
		primary: [
			"#f1e4ff",
			"#d0b3ff",
			"#ac80ff",
			"#974dfe",
			"#881cfd",
			"#7e03e4",
			"#6e01b2",
			"#570080",
			"#3a004f",
			"#18001f",
		],
		secondary: ["#53525C"],
		accent: [
			"#EEE5FF",
			"#D0B8FF",
			"#B28AFF",
			"#955CFF",
			"#772EFF",
			"#5900FF",
			"#4700CC",
			"#350099",
			"#230066",
			"#120033",
		],
		dark: [
			"#FFF",
			"#acaebf",
			"#8c8fa3",
			"#666980",
			"#4d4f66",
			"#34354a",
			"#2b2c3d",
			"#0d1117",
			"#0c0d21",
			"#01010a",
		],
	},
	primaryShade: 1,
	defaultRadius: "md",
}

export default theme
