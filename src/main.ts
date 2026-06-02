import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import { initApp } from "./App";

setDefaultOptions({ locale: ru });

document.addEventListener("DOMContentLoaded", () => {
	initApp();
});
