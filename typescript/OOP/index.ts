//  npx tsx index.ts

console.log("test");

export class Bucket {
  protected bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  public getUrl(): string {
    return `https://${this.bucketName}.s3.amazonaws.com`;
  }

  public getName(): string {
    return this.bucketName;
  }
}

// A new sub bucket that inherits the methods and attributes of the parent Bucket class
export class SubBucket extends Bucket {
  constructor(bucketName: string) {
    super(bucketName);
  }
}

export class SuBBucket extends Bucket {
  constructor(bucketName: string) {
    const appendedName = bucketName.startsWith("fp-")
      ? bucketName
      : `fp-${bucketName}`;
    super(appendedName);
  }
}
