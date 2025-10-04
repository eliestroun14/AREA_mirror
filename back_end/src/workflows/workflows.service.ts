// Trigger -> Renvoie true ou false en fonction de s'ils ont été déclenché ou pas
// Action -> Prend en paramètre le zap_step_execution.data de son précédent

// function step.run(executions)
//     si !executions.contains(step.source_step_id)
//         source = zap_steps.get(step.source_step_id)
//         source.run(execution)
//     formatted_payload = format_payload(step.payload, source.data)
//     step.data = step.execute_action(formatted_payload) // Abstract method to implement for each action
//     executions.add({ step_id: step.id, data: step.data })
// fi

// Workflow générique :
// pour chaque zap : zaps
//     récupérer le trigger
//     si trigger.test() === false
//         continue
//     executions_data = [{
//         step_id: trigger.step_id, data: trigger.data
//     }]
//     créer un zap_executions (zap.id, In Progress, 0, now(), now())
//     pour chaque step : zap_steps
//         si step.step_type === "TRIGGER"
//             continue
//         step.run()
//         data = executions_data.get(step.source_step_id)

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { ZapsService } from '@app/zaps/zaps.service';
import { ZapDTO } from '@app/zaps/zaps.dto';
import { StepsService } from '@app/zaps/steps/steps.service';

@Injectable()
export class WorkflowService {
  constructor(
    private prisma: PrismaService,
    private zapsService: ZapsService,
    private stepsService: StepsService,
  ) {}

  async workflow() {
    const zaps = await this.zapsService.getAllZaps();

    for (const zap of zaps) {
      //await this.stepsService.getTriggerOf(zap.id);
    }
  }
}
