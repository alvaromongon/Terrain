module Terrain.Utilities {

    export class CountDownEvent {

        private signalsToWait: number;
        private data: any;
        private functionToRun;

        constructor(signalsToWait: number, data: any, functionToRun: (data: any) => void) {
            this.signalsToWait = signalsToWait;
            this.data = data;
            this.functionToRun = functionToRun;

            if (this.IsReadyToRaiseEvent()) {
                this.RunFunction();
            }
        }

        public Signal(): void {
            this.signalsToWait = this.signalsToWait - 1;

            if (this.IsReadyToRaiseEvent()) {
                this.RunFunction();
            }
        }

        public SignalSeveral(numberOfSignals: number): void {
            this.signalsToWait = this.signalsToWait - numberOfSignals;

            if (this.IsReadyToRaiseEvent()) {
                this.RunFunction();
            }
        }

        private IsReadyToRaiseEvent(): boolean {
            return this.signalsToWait <= 0;
        }

        private RunFunction(): void {
            this.functionToRun(this.data);
        }
    }
}