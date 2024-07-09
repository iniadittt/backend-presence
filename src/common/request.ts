import { User } from "@prisma/client";

export default interface AuthenticationRequest extends Request {
    user?: User;
}