// 8-bit combinational ALU. op: 000 ADD, 001 SUB, 010 AND, 011 OR, 100 XOR.
module alu8 (
    input wire [7:0] a,
    input wire [7:0] b,
    input wire [2:0] op,
    output reg [7:0] result,
    output reg carry_borrow,
    output wire zero
);
    always @* begin
        result = 8'h00;
        carry_borrow = 1'b0;
        case (op)
            3'd0: begin
                {carry_borrow, result} = {1'b0, a} + {1'b0, b};
            end
            3'd1: begin
                result = a - b;
                carry_borrow = (a < b); // unsigned borrow
            end
            3'd2: result = a & b;
            3'd3: result = a | b;
            3'd4: result = a ^ b;
            default: begin result = 8'h00; carry_borrow = 1'b0; end
        endcase
    end
    assign zero = (result == 8'h00);
endmodule
