import modules from 'app/modules';

export function resolver(obj, args) {
  return modules.list;
}

export const definition = `
  modules: [Module]
`;
