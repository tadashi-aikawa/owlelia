import type { BaseError } from "../error";
import type { AsyncResult, Nullable } from "../result";
import { isEmpty } from "./utils";

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
    public loading = false,
    public error: Nullable<E> = null,
  ) {
    this.initialValue = value;
  }

  isEmpty(): boolean {
    return isEmpty(this.value);
  }

  async load(
    asyncFunc: () => AsyncResult<T, E>,
    option?: LiquidValueLoadOption,
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
