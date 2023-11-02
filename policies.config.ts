import { Policy } from './src/policies/builder';
import smartChecker from './src/smart_checker';

let policies:Array<Policy> = [

    {
        type: 'check',
        operations: ['get'],
        graph: 'people',

        check: function (): Boolean {
            return true;
        }

    }

];

export default policies;