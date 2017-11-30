import { Period } from '../deadlineBaseAlgorithm/interfaceFristDNA';
import { Deadline } from '../deadlineBaseAlgorithm/getDeadline';

export class DeadlineUnit {
    constructor (
        public period: Period,
        public date: Date
    ) {}
}

export class DeadlineRequest {
    constructor (
        public deadlines: DeadlineUnit[],
        public edgeDate: EdgeDate,
        public currentEdgeDate: Date
    ) {}
}

export class EdgeDate {
    constructor (
        public includes: DeadlineUnit[],
        public excludes: DeadlineUnit[]
    ) {}
}
