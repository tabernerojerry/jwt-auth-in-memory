import { Types } from "mongoose";
import { GraphQLScalarType, Kind } from "graphql";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "MongoDB object id scalar type",
  parseValue(value: string) {
    return new Types.ObjectId(value); // value from the client input variables
  },
  serialize(value: Types.ObjectId) {
    return new Types.ObjectId(value); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Types.ObjectId(ast.value); // value from the client query
    }
    return null;
  },
});