import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Wag Wise Mentor API is running! 🐕";
  }
}
