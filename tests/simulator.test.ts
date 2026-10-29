import {describe,it,expect} from 'vitest';
import {initialCPU,parseProgram,runProgram,readReg,writeReg,executeOne} from '../src/simulator';
function run(code:string){const p=parseProgram(code);return runProgram(initialCPU(),p);}
describe('MicroVision instruction simulator',()=>{
it('runs 16-bit addition',()=>{const {cpu}=run('MOV AX, 1234H\nMOV BX, 0002H\nADD AX, BX\nHLT');expect(cpu.regs.AX).toBe(0x1236);expect(cpu.regs.BX).toBe(2);expect(cpu.status).toBe('halted');});
it('synchronizes high and low registers',()=>{const c=initialCPU();writeReg(c,'AH',0x12);writeReg(c,'AL',0x34);expect(c.regs.AX).toBe(0x1234);writeReg(c,'AX',0xABCD);expect(readReg(c,'AH')).toBe(0xAB);expect(readReg(c,'AL')).toBe(0xCD);});
it('handles 8-bit addition and carry',()=>{const {cpu}=run('MOV AL, 0FFH\nADD AL, 01H\nHLT');expect(readReg(cpu,'AL')).toBe(0);expect(cpu.flags.CF).toBe(1);expect(cpu.flags.ZF).toBe(1);expect(cpu.flags.PF).toBe(1);});
it('takes conditional jump',()=>{const {cpu,history}=run('MOV AX, 0005H\nCMP AX, 0005H\nJZ EQUAL\nMOV BX, 0001H\nJMP DONE\nEQUAL:\nMOV BX, 0002H\nDONE:\nHLT');expect(cpu.regs.BX).toBe(2);expect(cpu.flags.ZF).toBe(1);expect(history.some(h=>h.text==='MOV BX, 0001H')).toBe(false);});
it('pushes and pops',()=>{const {cpu}=run('MOV AX, 1234H\nPUSH AX\nMOV AX, 0000H\nPOP AX\nHLT');expect(cpu.regs.AX).toBe(0x1234);expect(cpu.stack).toHaveLength(0);expect(cpu.regs.SP).toBe(0);});
it('reports unsupported instructions',()=>{const {cpu}=run('ADDDD AX, BX');expect(cpu.status).toBe('error');expect(cpu.error).toContain('unsupported instruction');});
it('preserves CF for INC',()=>{const {cpu}=run('MOV AL, 0FFH\nADD AL, 01H\nINC AL\nHLT');expect(cpu.flags.CF).toBe(1);});
it('wraps 16-bit arithmetic and detects signed overflow',()=>{const {cpu}=run('MOV AX, 7FFFH\nADD AX, 0001H\nHLT');expect(cpu.regs.AX).toBe(0x8000);expect(cpu.flags.OF).toBe(1);expect(cpu.flags.SF).toBe(1);});
it('rejects operand width mismatch',()=>{const {cpu}=run('MOV AX, 1\nADD AX, BL');expect(cpu.status).toBe('error');expect(cpu.error).toContain('size mismatch');});
it('detects undefined labels and stack underflow',()=>{expect(()=>parseProgram('JMP MISSING')).toThrow(/undefined label/i);const {cpu}=run('POP AX');expect(cpu.error).toContain('stack underflow');});
it('supports case-insensitive instructions and comments',()=>{const {cpu}=run('mov ax, 10 ; decimal ten\nhlt');expect(cpu.regs.AX).toBe(10);});
it('protects against infinite loops',()=>{const p=parseProgram('AGAIN: JMP AGAIN');const {cpu}=runProgram(initialCPU(),p,12);expect(cpu.status).toBe('limit');expect(cpu.steps).toBe(12);});
it('parses hexadecimal zero and 0x prefix',()=>{const {cpu}=run('MOV AX, 0x10\nMOV BX, 0AH\nHLT');expect(cpu.regs.AX).toBe(16);expect(cpu.regs.BX).toBe(10);});
});
