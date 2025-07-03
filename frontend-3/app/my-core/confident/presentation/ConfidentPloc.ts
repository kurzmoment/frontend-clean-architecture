import { ConfidentState, confidentInitialState } from "./ConfidentState";
import { Ploc } from "../../common/presentation/Ploc";
import { GetConfidentsUseCase } from "../domain/usecases/GetConfidentsUseCase";
import { CreateConfidentUseCase } from "../domain/usecases/CreateConfidentUseCase";
import { UpdateConfidentUseCase } from "../domain/usecases/UpdateConfidentUseCase";
import { DeleteConfidentUseCase } from "../domain/usecases/DeleteConfidentUseCase";
import {
  ConfidentEntity,
  CreateConfidentData,
  UpdateConfidentData,
} from "../domain/Confident";
import { DataError } from "../../common/domain/DataError";

export class ConfidentPloc extends Ploc<ConfidentState> {
  private currentUserId: number;

  constructor(
    private getConfidentsUseCase: GetConfidentsUseCase,
    private createConfidentUseCase: CreateConfidentUseCase,
    private updateConfidentUseCase: UpdateConfidentUseCase,
    private deleteConfidentUseCase: DeleteConfidentUseCase,
    userId: number
  ) {
    super(confidentInitialState);
    this.currentUserId = userId;
    this.loadConfidents();
  }

  async loadConfidents() {
    const result = await this.getConfidentsUseCase.execute(this.currentUserId);

    result.fold(
      (error) => this.changeState(this.handleError(error)),
      (confidents) => this.changeState(this.mapToLoadedState(confidents))
    );
  }

  async createConfident(data: CreateConfidentData) {
    const result = await this.createConfidentUseCase.execute(
      data,
      this.currentUserId
    );

    result.fold(
      (error) => this.changeState(this.handleError(error)),
      (confident) => {
        if (this.state.kind === "LoadedConfidentState") {
          const updatedConfidents = [...this.state.confidents, confident];
          this.changeState(this.mapToLoadedState(updatedConfidents));
        }
      }
    );
  }

  async updateConfident(id: number, data: UpdateConfidentData) {
    const result = await this.updateConfidentUseCase.execute(
      id,
      data,
      this.currentUserId
    );

    result.fold(
      (error) => this.changeState(this.handleError(error)),
      (updatedConfident) => {
        if (this.state.kind === "LoadedConfidentState") {
          const updatedConfidents = this.state.confidents.map((confident) =>
            confident.id === id ? updatedConfident : confident
          );
          this.changeState(this.mapToLoadedState(updatedConfidents));
        }
      }
    );
  }

  async deleteConfident(id: number) {
    const result = await this.deleteConfidentUseCase.execute(
      id,
      this.currentUserId
    );

    result.fold(
      (error) => this.changeState(this.handleError(error)),
      (success) => {
        if (success && this.state.kind === "LoadedConfidentState") {
          const updatedConfidents = this.state.confidents.filter(
            (confident) => confident.id !== id
          );
          this.changeState(this.mapToLoadedState(updatedConfidents));
        }
      }
    );
  }

  private mapToLoadedState(confidents: ConfidentEntity[]): ConfidentState {
    return {
      kind: "LoadedConfidentState",
      confidents,
    };
  }

  private handleError(error: DataError): ConfidentState {
    switch (error.kind) {
      case "UnexpectedError": {
        return {
          kind: "ErrorConfidentState",
          error: "Sorry, an error has occurred. Please try again later.",
        };
      }
    }
  }
}
