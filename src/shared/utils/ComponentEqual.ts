import * as React from 'react';
export const componentTypeEqual = (cmponent: React.ClassType<any,any,any>, target: React.ReactChild): boolean =>{
    return (target as any).type.prototype instanceof cmponent;
}