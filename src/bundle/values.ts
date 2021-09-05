import { AsyncResult, Nullable } from "../result";
import { BaseError } from "../error";

interface LiquidValueLoadOption {
  silent?: boolean;
  clearValueBeforeLoading?: boolean;
  clearErrorBeforeLoading?: boolean;
  keepValueIfError?: boolean;
}

// noinspection AssignmentToFunctionParameterJS
export class LiquidValue<T, E = BaseError> {
  initialValue: Nullable<T>;

  constructor(
    public value: Nullable<T>,
    public loading: boolean = false,
    public error: Nullable<E> = null
  ) {
    this.initialValue = value;
  }

  async load(
    asyncFunc: () => AsyncResult<T, E>,
    option?: LiquidValueLoadOption
  ): Promise<void> {
    if (option?.clearValueBeforeLoading) {
      this.value = this.initialValue;
    }
    if (option?.clearErrorBeforeLoading) {
      this.error = null;
    }
    if (!option?.silent) {
      this.loading = true;
    }

    const ret = await asyncFunc();
    if (ret.isErr()) {
      if (!option?.keepValueIfError) {
        this.value = this.initialValue;
      }
      this.error = ret.error;
    } else {
      this.error = null;
      this.value = ret.value;
    }

    if (!option?.silent) {
      this.loading = false;
    }
  }
}
