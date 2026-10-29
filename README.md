# MicroVision AI

Agentic AI-Based Microprocessor Instruction Execution Visualizer — a beginner-friendly MPMC project.

## Run locally / on Replit

1. Upload or import this project folder into a Node.js Replit project.
2. Run `npm install`.
3. Run `npm run dev` (Replit exposes the Vite webview on the forwarded port).
4. For a production build, run `npm run build`; preview it with `npm run preview`.

No database, login, API key, or external AI service is needed for the simulator. Google Fonts is optional styling; the app otherwise uses local system fonts.

## Features

- Editable assembly source, example programs, Run / Step / Reset controls.
- 16-bit general registers and synchronised 8-bit high/low views.
- CF, ZF, SF, OF, PF flags; arithmetic wrapping and overflow/carry logic.
- Labels, semicolon comments, stack, conditional jumps and instruction limit.
- Per-instruction register/flag snapshots and execution history.
- Local rule-based assistant that reads current simulator state.
- Interactive ALU arithmetic/logic preview.
- Separate synthesizable Verilog ALU and testbench in `verilog/`.

## Supported instruction subset

`MOV`, `ADD`, `ADC`, `SUB`, `SBB`, `INC`, `DEC`, `AND`, `OR`, `XOR`, `NOT`, `TEST`, `CMP`, `JMP`, `JE`, `JZ`, `JNE`, `JNZ`, `JC`, `JNC`, `PUSH`, `POP`, `HLT`.

Supported operands are registers and immediate values, except stack instructions' documented restrictions. This is an educational subset, not a complete 8086 emulator. Memory operands, segment registers, interrupts, machine-code encoding, I/O, timing, and many other 8086 features are not implemented. PF is even parity of the low byte. Logical operations set CF and OF to zero; undefined/architecture-specific flags outside the displayed subset are not modeled.

The educational stack is an array of 16-bit words. PUSH decrements SP by two and POP increments it by two; it does not model memory or stack-address wraparound.

## Assistant and security

The assistant is explicitly a **Local Rule-Based Assistant — No AI API Configured**. It is not an LLM or agent. No backend/provider integration is implemented, so there are no API keys to configure. If a real provider is added later, keep credentials on a server and use validated tools to inspect and execute code rather than accepting model-invented state.

## Verilog ALU

`verilog/alu8.v` implements ADD, SUB, AND, OR and XOR. `carry_borrow` is carry-out for ADD and unsigned borrow for SUB, and is zero for logical operations. `zero` reflects whether the 8-bit result is zero. This module is separate; the browser does not run Verilog.

Run tests with Icarus Verilog installed:

```sh
iverilog -g2012 -o alu_test verilog/alu8.v verilog/alu8_tb.v
vvp alu_test
```

Expected terminal output includes `ALL TESTS PASSED`. Icarus Verilog was not available in the authoring environment unless the completion report explicitly says it was installed.

## Tests

`npm test` runs the simulator unit tests. `npm run build` type-checks and creates the production bundle.
