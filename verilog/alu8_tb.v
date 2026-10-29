`timescale 1ns/1ps
module alu8_tb;
    reg [7:0] a, b;
    reg [2:0] op;
    wire [7:0] result;
    wire carry_borrow, zero;
    integer errors = 0;
    alu8 dut(.a(a), .b(b), .op(op), .result(result), .carry_borrow(carry_borrow), .zero(zero));
    task check;
        input [7:0] exp_result;
        input exp_carry;
        input exp_zero;
        input [8*40-1:0] label_text;
        begin
            #1;
            if (result !== exp_result || carry_borrow !== exp_carry || zero !== exp_zero) begin
                $display("FAIL %0s: got result=%h carry/borrow=%b zero=%b", label_text, result, carry_borrow, zero);
                errors = errors + 1;
            end else $display("PASS %0s", label_text);
        end
    endtask
    initial begin
        a=8'h12; b=8'h03; op=0; check(8'h15,0,0,"ADD normal");
        a=8'hFF; b=8'h01; op=0; check(8'h00,1,1,"ADD carry and zero");
        a=8'h03; b=8'h05; op=1; check(8'hFE,1,0,"SUB borrow");
        a=8'h07; b=8'h07; op=1; check(8'h00,0,1,"SUB zero");
        a=8'hF0; b=8'h0F; op=2; check(8'h00,0,1,"AND zero");
        a=8'hF0; b=8'h0F; op=3; check(8'hFF,0,0,"OR");
        a=8'hAA; b=8'hFF; op=4; check(8'h55,0,0,"XOR");
        a=8'h01; b=8'h01; op=4; check(8'h00,0,1,"XOR zero");
        if (errors == 0) $display("ALL TESTS PASSED");
        else $display("%0d TEST(S) FAILED", errors);
        $finish;
    end
endmodule
