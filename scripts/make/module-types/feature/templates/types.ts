export default function typesTemplate(pascalName: string): string {
  return `// TODO: define the ${pascalName} models
        export interface ${pascalName} {
          id: string;
        }
`;
}
