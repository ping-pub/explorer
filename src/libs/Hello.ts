interface hello {
    name: string;
}

class HelloType implements hello {
    name: string

    constructor(name: string) {
      this.name = name
    }
}
console.log('Hello from typescript', new HelloType('typescript'))
