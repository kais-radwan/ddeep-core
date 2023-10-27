import builder from './builder';
import policies_data from "../../policies.config";

const policies = builder.build(policies_data);

export default policies;