import { Policy } from './src/policies/builder';

let policies:Array<Policy> = [

    {
        type: 'check',
        operations: ['get'],
        graph: 'people',
        
        check: function (): true | false {
            return true;
        }

    }

]

export default policies;