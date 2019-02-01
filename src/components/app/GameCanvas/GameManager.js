import TimerStore from "../../../stores/TimerStore/TimerStore";
import GameStore from "../../../stores/GameStore/GameStore";

export class GameManager {

    static pauseCatalog(countdown) {
        TimerStore.pauseAllExcept(countdown);
        GameStore.options.setPause(true);
    }

    static playCatalog(countdown) {
        TimerStore.startAllExcept(countdown);
        GameStore.options.setPause(false);
    }

    static pauseGame() {
        TimerStore.pauseAll();
        GameStore.options.setPause(true);
    }

    static playGame() {
        TimerStore.startAll();
        GameStore.options.setPause(false);
    }
}