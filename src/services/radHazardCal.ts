export const handleRadiationParameterChanges = (value: string) => {
    const radiationLevel = parseFloat(value);
    if (!radiationLevel) {
        console.log("Расчет не выполнен");

        return; // обработка непредвиденных случаев, например, если состояние пустое или индекс недопустим
    }
    const maxSafeRadiation = 100; // Максимально допустимый уровень радиации в микрозивертах в час
    const permissibleTimeInMinutes = Math.floor((maxSafeRadiation / radiationLevel) * 60);

    const hours = Math.floor(permissibleTimeInMinutes / 60);
    const minutes = permissibleTimeInMinutes % 60;
    const time = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    console.log(time + "РАсчет времени");

    return time;
};
