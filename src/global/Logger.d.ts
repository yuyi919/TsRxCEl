import { Logger } from './Logger'

declare global {
    var logger: Logger
    namespace NodeJS{
        interface Global {
            logger: Logger
        }
    }
    interface Window {
        logger: Logger
    }
}