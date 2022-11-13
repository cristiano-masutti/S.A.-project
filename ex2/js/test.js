/**
 * Web Atelier 2022 2 - JavaScript
 *
 * Automated Tests Cases
 *
 */
let log = [];

function _countErrors(a, b, expected) {
    let result = countErrors(a, b);
    log.push({ a, b, result, expected });
    should.equal(result, expected);
    return result == expected;
}

function reporter(f) {
    return {
        reporter(out) {
            if (out.failed) {
                console.log(out);
                let l = log.pop();
                throw new Error(`${f}("${l.a}", "${l.b}") returned ${l.result}, expected ${l.expected}`);
            }
        }
    }
}

let fc_double = fc.double({ noDefaultInfinity: true, noNaN: true });



describe('Task 1', function () {

    describe('format_seconds', function () {

        let undef_str = "?:??.????";

        it('should return ' + undef_str, function () {

            should(format_seconds()).be.equal(undef_str);
            should(format_seconds("")).be.equal(undef_str);
            should(format_seconds({})).be.equal(undef_str);
            should(format_seconds([])).be.equal(undef_str);
            should(format_seconds(NaN)).be.equal(undef_str);

        });
        it('should return 0:00', function () {

            should(format_seconds(0)).equal("0:00.000");

        });

        it('should pad seconds', function () {
            fc.assert(fc.property(fc.integer(), (num) => {
                let s = format_seconds(num);
                let ss = s.split(":")[1].split(".")[0];
                if (Math.abs(num % 60) < 10) {
                    should("0").equal(ss.charAt(0));
                    should(2).equal(ss.length);
                } else {
                    should(parseInt(ss)).equal(Math.abs(num % 60));
                }
            }
            ))
        }
        );
        it('should not pad minutes', function () {
            fc.assert(fc.property(fc.integer(), (num) => {
                let s = format_seconds(num);
                if (num < 60 && num >= 0) {
                    should("0").equal(s.charAt(0));
                } else if (num > -60 && num < 0) {
                    should("0").equal(s.charAt(1));
                } else if (num <= -60) {
                    should("0").not.equal(s.charAt(1));
                } else {
                    should("0").not.equal(s.charAt(0));
                }
            }
            ))
        }
        );
        it('should have the minus sign at the beginning (-M:SS) for negative values', function () {
            fc.assert(fc.property(fc.integer(), (num) => {
                let s = format_seconds(num);

                if (num < 0) {
                    should("-").equal(s.charAt(0));
                    should(0).equal(s.indexOf("-"));
                    should(-1).equal(s.substring(1).indexOf("-"));
                } else {
                    should(-1).equal(s.indexOf("-"));
                }
            }
            ))
        }
        );
        it('should correctly split minutes from seconds', function () {
            fc.assert(fc.property(fc.integer(), fc.integer(), (min, sec) => {
                sec = Math.abs(sec) % 60;
                let d = min * 60 + sec;
                let s = format_seconds(d);
                let sm = s.split(":")[0];
                let ss = s.split(":")[1];
                if (d >= 0) {
                    should(parseInt(sm)).equal(min);
                    should(parseInt(ss)).equal(sec);
                } else if (min < 0 && sec == 0) {
                    should(parseInt(sm)).equal(min);
                    should(parseInt(ss)).equal(sec);
                } else if (min < 0 && sec > 0) {
                    should(parseInt(sm)).equal(min + 1);
                    should(parseInt(ss)).equal(60 - sec);
                } else {
                    should(parseInt(sm)).equal("-0");
                    should(parseInt(ss)).equal(sec);
                }
            }
            ))
        }
        );
        it('should include 3 fractional digits', function () {
            fc.assert(fc.property(fc_double, (num) => {
                let s = format_seconds(num);

                console.log(s);

                let f = Math.abs(Math.round(1000 * (num - Math.trunc(num))));

                if (f != 0) {

                    let sf = parseFloat(s.split(".")[1]);

                    should(sf).equal(f);
                }

            }
            ))
        }
        );
    });


    describe('scalar_product', function () {
        it('should return undefined', function () {

            should.not.exist(scalar_product());

        });

        it('should return undefined', function () {

            let a = [1, 2, 3];

            should.not.exist(scalar_product(a));

            fc.assert(fc.property(fc.array(fc_double), (arr) => {

                should.not.exist(scalar_product(arr));

            }));
        });

        it("preserves the length of the array", function () {

            fc.assert(fc.property(fc.array(fc_double), fc_double, (arr, num) => {

                let len = arr.length;
                should(len).equal(scalar_product(arr, num).length);

            }));
        });

        it("returns zero array if the factor is zero", function () {

            fc.assert(fc.property(fc.array(fc_double, { minLength: 1 }), (arr) => {

                let zero = new Array(arr.length).fill(0);
                should(zero).deepEqual(scalar_product(arr, 0));

            }));
        });

        it("preserves the array if the factor is one", function () {

            fc.assert(fc.property(fc.array(fc_double, { minLength: 1 }), (arr) => {

                should(arr).deepEqual(scalar_product(arr, 1));

            }));
        });

        it("allows factors to be combined", function () {

            fc.assert(fc.property(fc.array(fc.float()), fc.float(), fc.float(), (arr, n1, n2) => {

                should(scalar_product(scalar_product(arr, n1), n2)).deepEqual(scalar_product(arr, n1 * n2));

            }));
        });

        it("returns undefined if first argument is not an array", function () {

            fc.assert(fc.property(fc.anything().filter(x => !Array.isArray(x)), fc.float(), (x, n) => {

                should.not.exist(scalar_product(x, n));

            }));
        });

        /*

                it(
                    "distributes over scalar addition",
                    "array integer", "integer", "integer",
                    function(arr, n1, n2) {
                        let c = _.cloneDeep(arr);
                        return propEqual(scalar_product(c, n1 + n2),
                            vectorSum(scalar_product(c, n1),
                                scalar_product(c, n2)), `scalar_product([${arr}], ${n1}+${n2})`, `vectorSum(scalar_product([${arr}], ${n1}), scalar_product([${arr}], ${n2}))`);
                    });
                it(
                    "distributes over vector addition",
                    arbs.equalLengthArrays(jsc.integer, jsc.integer), "integer",
                    function(arrs, n) {
                        let [a1, a2] = arrs;
                        return propEqual(scalar_product(vectorSum(a1, a2), n),
                            vectorSum(scalar_product(a1, n),
                                scalar_product(a2, n)), `scalar_product(vectorSum([${a1}],[${a2}]), ${n})`, `vectorSum(scalar_product([${a1}],${n}), scalar_product([${a2}],${n}))`);
                    });
        */
    });

    describe('inner_product', function () {

        it("is undefined with undefined parameters", function () {

            should.not.exist(inner_product());

            fc.assert(fc.property(fc.array(fc.integer()), (a) => {

                should.not.exist(inner_product(a));

            }));

        });

        it("is undefined with non-Array parameters", function () {

            should.not.exist(inner_product());

            fc.assert(fc.property(fc.anything(), fc.anything().filter(x => !Array.isArray(x)), (a, x) => {

                should.not.exist(inner_product(a, x));

            }));

        });

        it("is symmetric", function () {

            fc.assert(fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a1, a2) => {

                let len = Math.min(a1.length, a2.length);

                a1 = a1.slice(0, len);
                a2 = a2.slice(0, len);

                (inner_product(a1, a2)).should.equal(inner_product(a2, a1));

            }));

        });

        it("returns non-negative number when multiplying vector to itself", function () {

            fc.assert(fc.property(fc.array(fc.integer()), (a) => {

                return inner_product(a, a) >= 0;

            }));

        });


        it("returns zero when multiplying to a zero-filled array", function () {

            fc.assert(fc.property(fc.array(fc.integer()), (a) => {

                let zero = new Array(a.length).fill(0);

                (0).should.equal(inner_product(a, zero));

            }));

        });

        it("returns undefined with arrays of different lengths", function () {

            fc.assert(fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a1, a2) => {

                if (a1.length != a2.length) {

                    should.not.exist(inner_product(a1, a2));

                }

            }));

        });





        /*

        property(
            "doesn't change the source arrays",
            arbs.equalLengthArrays(jsc.number, jsc.number),
            function(arrs) {
                let [a1, a2] = arrs;
                let copy1 = _.cloneDeep(a1);
                let copy2 = _.cloneDeep(a2);
                var t = inner_product(a1, a2);
                return propEqual(a1, copy1) && propEqual(a2, copy2, `inner_product([${a1}],[${a2}])`);
            });

        property(
            "is linear wrt scalar product and vector addition",
            arbs.equalLengthArrays(jsc.integer, jsc.integer, jsc.integer),
            "integer", "integer",
            function(arrs, x, y) {
                let [a1, a2, a3] = arrs;
                return propEqual(inner_product(a1,
                        vectorSum(scalar_product(a2, x),
                            scalar_product(a3, y))),
                    x * inner_product(a1, a2) + y * inner_product(a1, a3), `inner_product([${a1}], vectorSum(scalar_product([${a2}],${x}), scalar_product([${a3}],${y})))`, `${x}*inner_product([${a1}],[${a2}]) + ${y}*inner_product([${a1}],[${a3}])`);
            });


        */


    });






    describe('getErrors', function () {

        it('should return undefined', function () {

            should.not.exist(getErrors());

            fc.assert(fc.property(fc.string(), (text) => should.not.exist(getErrors(text))));

        });

        it('result array should be as long as the first input string', function () {

            fc.assert(fc.property(fc.string(), fc.string(), (text, text2) => {

                let errors = getErrors(text, text2);

                should.equal(errors.length, text.length);

            }));

        });

        it('result array should contain all false elements for identical strings', function () {

            fc.assert(fc.property(fc.string(), (text) => {

                let errors = getErrors(text, text);

                should.equal(true, errors.every(t => t === false));

            }));

        });

        it('result array should contain as many true elements as there are different characters', function () {

            fc.assert(fc.property(fc.string(), fc.string(), (text, text2) => {

                let errors = getErrors(text, text2 + text);

                should.equal(countErrors(text, text2 + text), errors.filter(t => t === true).length);

            }));

        });

    });



    describe('countErrors', function () {
        it('should return undefined', function () {

            should.not.exist(countErrors());

            fc.assert(fc.property(fc.string(), (text) => should.not.exist(countErrors(text))));

        });
        it('should return zero with identical input', function () {

            fc.assert(fc.property(fc.string(), (text) => _countErrors(text, text, 0)), reporter("countErrors"));

        });
        it('should return zero with identical initial substring', function () {

            fc.assert(fc.property(fc.string(), fc.string(), (text, text2) => _countErrors(text, text + text2, 0)), reporter("countErrors"));

        });
        it('should return one with almost identical strings', function () {

            fc.assert(fc.property(fc.string(), fc.char(), fc.char(),
                (
                    text, a, b) => _countErrors(text + a, text + b, (a == b) ? 0 : 1)

            ), reporter("countErrors"));

        });
        it('should return the number of different characters with different strings', function () {

            fc.assert(fc.property(fc.string({ minLength: 3, maxLength: 1024 }), fc.char(), fc.integer({ min: 2, max: 100 }),
                (text, c, d) => {

                    let diffCount = 0;
                    let diff = Array.from(text).map((t, i) => {

                        if (Math.random() > 0.5) {

                            diffCount += (t != c) ? 1 : 0;

                            return c;

                        }

                        return t;

                    }).join("");

                    return _countErrors(text, diff, diffCount);
                }), reporter("countErrors"));

        });
        it('should return the number of extra characters if the first string contains the second one', function () {

            fc.assert(fc.property(fc.string(), fc.string(),

                (text, text2) => _countErrors(text + text2, text, text2.length)), reporter("countErrors"));

        });
    });


    describe('detectCollisionRect', function () {

        it('true when point is inside the rectangle', function () {

            fc.assert(fc.property(fc.nat(), fc.nat(), (x, y) => {

                should(true).be.exactly(detectCollisionRect(x, y, x - 1, y - 1, 2, 2));

            }));

        });

        it('true when point is on the rectangle edge', function () {

            fc.assert(fc.property(fc.nat(), fc.nat(), (x, y) => {

                should(true).be.exactly(detectCollisionRect(x, y, x, y, 2, 2));
                should(true).be.exactly(detectCollisionRect(x, y, x - 2, y, 2, 2));
                should(true).be.exactly(detectCollisionRect(x, y, x, y - 2, 2, 2));
                should(true).be.exactly(detectCollisionRect(x, y, x - 2, y - 2, 2, 2));

            }));

            fc.assert(fc.property(fc.nat(), fc.nat(), fc.nat(), fc.nat(), (x, y, w, h) => {

                w++;
                h++;

                should(true).be.exactly(detectCollisionRect(x, y, x, y, w, h));
                should(true).be.exactly(detectCollisionRect(x, y, x - w, y, w, h));
                should(true).be.exactly(detectCollisionRect(x, y, x, y - h, w, h));
                should(true).be.exactly(detectCollisionRect(x, y, x - w, y - h, w, h));

            }));

        });

        it('false when point is outside the rectangle', function () {

            fc.assert(fc.property(fc.nat(), fc.nat(), (x, y) => {

                should(false).be.exactly(detectCollisionRect(x, y, x - 1, y + 1, 2, 2));
                should(false).be.exactly(detectCollisionRect(x, y, x + 1, y - 1, 2, 2));

                should(false).be.exactly(detectCollisionRect(x, y, x - 1, y - 3, 2, 2));
                should(false).be.exactly(detectCollisionRect(x, y, x - 3, y - 1, 2, 2));

                should(false).be.exactly(detectCollisionRect(x, y, x + 1, y + 1, 2, 2));
                should(false).be.exactly(detectCollisionRect(x, y, x - 3, y + 1, 2, 2));
                should(false).be.exactly(detectCollisionRect(x, y, x + 1, y - 3, 2, 2));
                should(false).be.exactly(detectCollisionRect(x, y, x - 3, y - 3, 2, 2));

            }));


            fc.assert(fc.property(fc.nat(), fc.nat(), fc.nat(), fc.nat(), (x, y, w, h) => {

                let ww = w + 1;
                let hh = h + 1;

                should(false).be.exactly(detectCollisionRect(x, y, x - ww, y, w, h));
                should(false).be.exactly(detectCollisionRect(x, y, x, y - hh, w, h));

                should(false).be.exactly(detectCollisionRect(x, y, x, y + hh, w, h));
                should(false).be.exactly(detectCollisionRect(x, y, x + ww, y, w, h));

                should(false).be.exactly(detectCollisionRect(x, y, x + ww, y + hh, w, h));
                should(false).be.exactly(detectCollisionRect(x, y, x - ww, y + hh, w, h));
                should(false).be.exactly(detectCollisionRect(x, y, x + ww, y - hh, w, h));
                should(false).be.exactly(detectCollisionRect(x, y, x - ww, y - hh, w, h));

            }));

        });

    });



    describe('detectCollisionRectArray', function () {

        it("undefined with missing or empty array", function () {

            should.not.exist(detectCollisionRectArray());

            fc.assert(fc.property(fc.nat(), fc.nat(), (x, y) => {

                should.not.exist(detectCollisionRectArray(x, y));
                should.not.exist(detectCollisionRectArray(x, y, []));

            }));

        });

        it("true with at least one collision", function () {

            fc.assert(fc.property(fc.nat(), fc.nat(), fc.nat(), fc.nat(), (x, y, w, h) => {

                let ww = w + 1;
                let hh = h + 1;

                let a = [];
                a.push([x - ww, y, w, h]);
                a.push([x, y - hh, w, h]);
                a.push([x, y + hh, w, h]);
                a.push([x + ww, y, w, h]);
                a.push([x + ww, y + hh, w, h]);
                a.push([x - ww, y + hh, w, h]);
                a.push([x + ww, y - hh, w, h]);
                a.push([x - ww, y - hh, w, h]);

                a[Math.floor(Math.random()*a.length)] = [x - ww, y - hh, w + ww, h + hh];

                (true).should.equal(detectCollisionRectArray(x, y, a));

            }));

        })

        it("false with no collision", function () {

            fc.assert(fc.property(fc.nat(), fc.nat(), fc.nat(), fc.nat(), (x, y, w, h) => {

                let ww = w + 1;
                let hh = h + 1;

                let a = [];
                a.push([x - ww, y, w, h]);
                a.push([x, y - hh, w, h]);
                a.push([x, y + hh, w, h]);
                a.push([x + ww, y, w, h]);
                a.push([x + ww, y + hh, w, h]);
                a.push([x - ww, y + hh, w, h]);
                a.push([x + ww, y - hh, w, h]);
                a.push([x - ww, y - hh, w, h]);

                (false).should.equal(detectCollisionRectArray(x, y, a));

            }));

        });

    });


});
describe('Task 2', function () {

    describe('startClock', function () {

        it('should return undefined', function () {

            should.not.exist(startClock());

        });

        it('should return a function', function () {

            let f = startClock(0);
            should("function").equal(typeof f);

        });

        it('result function should return same value when initialized with zero', function () {

            let f = startClock(0);

            fc.assert(fc.property(fc_double, (num) => {
                should(num).equal(f(num));
            }))

        });

        it('result function should return difference with initial time', function () {

            fc.assert(fc.property(fc_double, (t0) => {

                let f = startClock(t0);

                fc.assert(fc.property(fc_double, (num) => {
                    should(num - t0).equal(f(num));
                }))

            }));

        });

        it('result functions should return difference with corresponding initial time', function () {

            fc.assert(fc.property(fc_double, fc_double, (t0, t1) => {

                let f = startClock(t0);
                let g = startClock(t1);

                fc.assert(fc.property(fc_double, (num) => {
                    should(num - t0).equal(f(num));
                    should(num - t1).equal(g(num));
                }))

            }));

        });

    });

    describe('iterator', function () {
        it("iterator without array is undefined", function () {

            fc.assert(fc.property(fc.anything().filter(x => !Array.isArray(x)), (x) => {
                let y = iterator(x);
                should.not.exist(y);
            }));

        });
        it("iterator with array returns function", function () {

            fc.assert(fc.property(fc.array(fc.anything()), (arr) => {
                ("function").should.equal(typeof iterator(arr));
            }));

        });

    });
    describe('next', function () {

        it("calling next() once returns the first element of the array", function () {

            fc.assert(fc.property(fc.array(fc.anything(), { minLength: 1 }), (arr) => {

                let next = iterator(arr);
                let result = next();

                should(result).equal(arr[0]);

            }));

        });

        it("calling next() twice returns the second element of the array", function () {

            fc.assert(fc.property(fc.array(fc.anything(), { minLength: 2 }), (arr) => {

                let next = iterator(arr);
                let result = next();
                let result2 = next();

                should(result).equal(arr[0]);
                should(result2).equal(arr[1]);

            }));

        });

        it("calling next() multiple times returns every element of the array one by one", function () {

            fc.assert(fc.property(fc.array(fc.anything(), { minLength: 3 }), (arr) => {

                let next = iterator(arr);

                let check = [];

                arr.forEach((e, i) => {
                    check.push(next());
                })

                should(arr).deepEqual(check);

            }));

        });

        it("calling next() beyond the end of the array throws an Error", function () {

            fc.assert(fc.property(fc.array(fc.anything(), { minLength: 3 }), (arr) => {

                let next = iterator(arr);

                (function scan() {
                    for (let i = 0; i < arr.length; i++) next();
                }).should.not.throw();

                (next).should.throw();

            }));

        });

    });
    describe('next (advanced)', function () {

        it("calling next(0) returns the initial position", function () {

            fc.assert(fc.property(fc.array(fc.anything(), { minLength: 3 }), (arr) => {

                let next = iterator(arr);

                (0).should.equal(next(0));

            }));

        });

        it("calling next(0) returns the current position", function () {

            fc.assert(fc.property(fc.array(fc.anything(), { minLength: 3 }), fc.nat(), (arr, num) => {

                let next = iterator(arr);

                num = Math.min(arr.length - 1, num);

                for (let i = 0; i < num; i++) next();

                (num).should.equal(next(0));

            }));

        });

        it("calling next(-1) and next() again should go back to the previous element", function () {

            fc.assert(fc.property(fc.array(fc.string(), { minLength: 3 }), fc.nat(), (arr, num) => {

                let next = iterator(arr);

                let prev = next();

                next(-1);

                let again = next();

                (prev).should.equal(again);

            }));

        });

        it("calling next([]) returns next itself", function () {

            fc.assert(fc.property(fc.array(fc.string(), { minLength: 3 }), fc.nat(), (arr, num) => {

                let next = iterator(arr);

                let beyond = next(arr);

                ("function").should.equal(typeof beyond);
                (next).should.equal(beyond);

            }));

        });

        it("calling next([]) resets the iterator to the initial position", function () {

            fc.assert(fc.property(fc.array(fc.string(), { minLength: 3 }), fc.nat(), (arr, num) => {

                let next = iterator(arr);

                let x = next();

                (1).should.equal(next(0));

                let beyond = next(arr);

                (0).should.equal(beyond(0));

                let y = beyond();

                (x).should.equal(y);

            }));

        });

    });

});

describe('Task 4', function () {

    function loadGame(check) {
        let x = document.querySelector("iframe");
        x.src = "play-typing-game.html";
        x.onload = function () {
            var y = (x.contentWindow || x.contentDocument);

            check(y.document);
        }
    }

    function startClick(doc) {
        let start = doc.querySelector('button[data-action="start"]');
        let clickEvent = new Event('click');
        start.dispatchEvent(clickEvent);
    }

    describe('button_start_click', function () {


        it("should start with a zero score", function (done) {

            loadGame(doc => {

                startClick(doc);

                try {

                    should("000000").be.equal(doc.querySelector(".score span").textContent);

                    done();

                } catch (e) {

                    done(e);

                }

            });
        });

        it("timer should start ticking", function (done) {

            loadGame(doc => {

                startClick(doc);

                setTimeout(()=>{

                    try {

                        should("00:00:00").not.be.equal(doc.querySelector(".time span").textContent);
                        should("0:00.000").not.be.equal(doc.querySelector(".time span").textContent);
                        should("?:??.???").not.be.equal(doc.querySelector(".time span").textContent);

                        done();

                    } catch (e) {

                        done(e);

                    }

                }, 100);

            });
        });

        it("timer should keep ticking", function (done) {

            loadGame(doc => {

                let time = doc.querySelector(".time span").textContent;

                startClick(doc);

                setTimeout(()=>{

                    try {

                        should(time).not.be.equal(doc.querySelector(".time span").textContent);

                        time = doc.querySelector(".time span").textContent;

                    } catch (e) {

                        done(e);

                    }

                }, 100);

                setTimeout(()=>{

                    try {

                        should(time).not.be.equal(doc.querySelector(".time span").textContent);

                        done();

                    } catch (e) {

                        done(e);

                    }

                }, 200);


            });
        });

        it("new challenge should be displayed", function (done) {

            loadGame(doc => {

                try {

                    let challenge = doc.querySelector(".challenge").textContent

                    startClick(doc);

                    should(challenge).not.be.equal(doc.querySelector(".challenge").textContent);

                    done();

                } catch (e) {

                    done(e);

                }

            });
        });

        it("input element should be empty and focused", function (done) {

            loadGame(doc => {

                try {

                    let input = doc.querySelector("#txt")

                    input.value = "some text";

                    startClick(doc);

                    should(0).be.equal(input.value.length);
                    should(doc.activeElement).be.equal(input);

                    done();

                } catch (e) {

                    done(e);

                }

            });
        });

    });


    describe('txt_input', function () {

        function txtInput(doc, key) {
            let input = doc.querySelector('#txt');
            Array.from(key).forEach(k => {
                input.value = input.value + k;
                let keyEvent = new Event('input', {
                    'key': k
                })
                input.dispatchEvent(keyEvent);
            })
        }

        it("should increase the score when typing one character", function (done) {

            loadGame(doc => {

                try {

                    let input = doc.querySelector("#txt")

                    startClick(doc);

                    should("000000").be.equal(doc.querySelector(".score span").textContent);

                    let challenge = doc.querySelector(".challenge").textContent

                    txtInput(doc, challenge[0]);

                    should("000000").not.be.equal(doc.querySelector(".score span").textContent);

                    done();

                } catch (e) {

                    done(e);

                }

            });

        })


        it("should use all ok styles when typing all correct characters", function (done) {

            loadGame(doc => {

                try {

                    let input = doc.querySelector("#txt")

                    startClick(doc);

                    let challenge = doc.querySelector(".challenge").textContent

                    should(true).be.equal(challenge.length > 0);

                    txtInput(doc, challenge);

                    should(challenge.length).be.equal(doc.querySelectorAll(".challenge span.ok").length);
                    should(0).be.equal(doc.querySelectorAll(".challenge span.error").length);
                    should(0).be.equal(doc.querySelectorAll(".challenge span.undef").length);

                    done();

                } catch (e) {

                    done(e);

                }

            });

        })

        it("should use one ok styles when typing first correct characters", function (done) {

            loadGame(doc => {

                try {

                    let input = doc.querySelector("#txt")

                    startClick(doc);

                    let challenge = doc.querySelector(".challenge").textContent

                    txtInput(doc, challenge[0]);

                    should(1).be.equal(doc.querySelectorAll(".challenge span.ok").length);
                    should(challenge.length - 1).be.equal(doc.querySelectorAll(".challenge span.undef").length);
                    should(0).be.equal(doc.querySelectorAll(".challenge span.error").length);

                    done();

                } catch (e) {

                    done(e);

                }

            });

        })

        it("should use error styles when typing first incorrect character", function (done) {

            loadGame(doc => {

                try {

                    let input = doc.querySelector("#txt")

                    startClick(doc);

                    let challenge = doc.querySelector(".challenge").textContent

                    txtInput(doc, challenge[1]); //assume 2nd character is different than 1st

                    should(1).be.equal(doc.querySelectorAll(".challenge span.error").length);
                    should(0).be.equal(doc.querySelectorAll(".challenge span.ok").length);
                    should(challenge.length - 1).be.equal(doc.querySelectorAll(".challenge span.undef").length);

                    done();

                } catch (e) {

                    done(e);

                }

            });

        })

        it("score should remain zero when typing first incorrect character", function (done) {

            loadGame(doc => {

                try {

                    let input = doc.querySelector("#txt")

                    startClick(doc);

                    let challenge = doc.querySelector(".challenge").textContent

                    txtInput(doc, challenge[1]); //assume 2nd character is different than 1st

                    should("000000").be.equal(doc.querySelector(".score span").textContent);

                    done();

                } catch (e) {

                    done(e);

                }

            });

        })

        it("should use error styles when typing incorrect characters", function (done) {

            loadGame(doc => {

                try {

                    let input = doc.querySelector("#txt")

                    startClick(doc);

                    let challenge = doc.querySelector(".challenge").textContent

                    let random_string = Array.from(challenge).map(c => String.fromCharCode(c.charCodeAt(0) + 1));

                    txtInput(doc, random_string);

                    let e = countErrors(random_string, challenge);

                    should(e).be.equal(doc.querySelectorAll(".challenge span.error").length);

                    done();

                } catch (e) {

                    done(e);

                }

            });

        })

        it("should reach perfect score when typing all correct characters", function (done) {

            loadGame(doc => {

                try {

                    let input = doc.querySelector("#txt")

                    startClick(doc);

                    should("000000").be.equal(doc.querySelector(".score span").textContent);

                    let challenge = doc.querySelector(".challenge").textContent

                    should(true).be.equal(challenge.length > 0);

                    txtInput(doc, challenge);

                    should(challenge.length).be.equal(parseInt(doc.querySelector(".score span").textContent));

                    done();

                } catch (e) {

                    done(e);

                }

            });

        })

    });
});
