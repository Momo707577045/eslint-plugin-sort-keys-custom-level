var a = {
  name: 'Tom',
  son: {
    name: '222',
    son: {
      name: '333'
    }
  }
}


const ast = {
  "type": "File",
  "start": 0,
  "end": 88,
  "loc": {
    "start": {
      "line": 1,
      "column": 0,
      "index": 0
    },
    "end": {
      "line": 9,
      "column": 1,
      "index": 88
    }
  },
  "errors": [],
  "program": {
    "type": "Program",
    "start": 0,
    "end": 88,
    "loc": {
      "start": {
        "line": 1,
        "column": 0,
        "index": 0
      },
      "end": {
        "line": 9,
        "column": 1,
        "index": 88
      }
    },
    "sourceType": "module",
    "interpreter": null,
    "body": [
      {
        "type": "VariableDeclaration",
        "start": 0,
        "end": 88,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 9,
            "column": 1,
            "index": 88
          }
        },
        "declarations": [
          {
            "type": "VariableDeclarator",
            "start": 4,
            "end": 88,
            "loc": {
              "start": {
                "line": 1,
                "column": 4,
                "index": 4
              },
              "end": {
                "line": 9,
                "column": 1,
                "index": 88
              }
            },
            "id": {
              "type": "Identifier",
              "start": 4,
              "end": 5,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 4,
                  "index": 4
                },
                "end": {
                  "line": 1,
                  "column": 5,
                  "index": 5
                },
                "identifierName": "a"
              },
              "name": "a"
            },
            "init": {
              "type": "ObjectExpression",
              "start": 8,
              "end": 88,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 8,
                  "index": 8
                },
                "end": {
                  "line": 9,
                  "column": 1,
                  "index": 88
                }
              },
              "properties": [
                {
                  "type": "ObjectProperty",
                  "start": 12,
                  "end": 24,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 2,
                      "index": 12
                    },
                    "end": {
                      "line": 2,
                      "column": 14,
                      "index": 24
                    }
                  },
                  "method": false,
                  "key": {
                    "type": "Identifier",
                    "start": 12,
                    "end": 16,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 2,
                        "index": 12
                      },
                      "end": {
                        "line": 2,
                        "column": 6,
                        "index": 16
                      },
                      "identifierName": "name"
                    },
                    "name": "name"
                  },
                  "computed": false,
                  "shorthand": false,
                  "value": {
                    "type": "StringLiteral",
                    "start": 18,
                    "end": 24,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 8,
                        "index": 18
                      },
                      "end": {
                        "line": 2,
                        "column": 14,
                        "index": 24
                      }
                    },
                    "extra": {
                      "rawValue": "Tom",
                      "raw": "'Tom'"
                    },
                    "value": "Tom"
                  }
                },
                {
                  "type": "ObjectProperty",
                  "start": 28,
                  "end": 86,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 2,
                      "index": 28
                    },
                    "end": {
                      "line": 8,
                      "column": 3,
                      "index": 86
                    }
                  },
                  "method": false,
                  "key": {
                    "type": "Identifier",
                    "start": 28,
                    "end": 31,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 2,
                        "index": 28
                      },
                      "end": {
                        "line": 3,
                        "column": 5,
                        "index": 31
                      },
                      "identifierName": "son"
                    },
                    "name": "son"
                  },
                  "computed": false,
                  "shorthand": false,
                  "value": {
                    "type": "ObjectExpression",
                    "start": 33,
                    "end": 86,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 7,
                        "index": 33
                      },
                      "end": {
                        "line": 8,
                        "column": 3,
                        "index": 86
                      }
                    },
                    "properties": [
                      {
                        "type": "ObjectProperty",
                        "start": 39,
                        "end": 50,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 4,
                            "index": 39
                          },
                          "end": {
                            "line": 4,
                            "column": 15,
                            "index": 50
                          }
                        },
                        "method": false,
                        "key": {
                          "type": "Identifier",
                          "start": 39,
                          "end": 43,
                          "loc": {
                            "start": {
                              "line": 4,
                              "column": 4,
                              "index": 39
                            },
                            "end": {
                              "line": 4,
                              "column": 8,
                              "index": 43
                            },
                            "identifierName": "name"
                          },
                          "name": "name"
                        },
                        "computed": false,
                        "shorthand": false,
                        "value": {
                          "type": "StringLiteral",
                          "start": 45,
                          "end": 50,
                          "loc": {
                            "start": {
                              "line": 4,
                              "column": 10,
                              "index": 45
                            },
                            "end": {
                              "line": 4,
                              "column": 15,
                              "index": 50
                            }
                          },
                          "extra": {
                            "rawValue": "222",
                            "raw": "'222'"
                          },
                          "value": "222"
                        }
                      },
                      {
                        "type": "ObjectProperty",
                        "start": 56,
                        "end": 82,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 4,
                            "index": 56
                          },
                          "end": {
                            "line": 7,
                            "column": 3,
                            "index": 82
                          }
                        },
                        "method": false,
                        "key": {
                          "type": "Identifier",
                          "start": 56,
                          "end": 59,
                          "loc": {
                            "start": {
                              "line": 5,
                              "column": 4,
                              "index": 56
                            },
                            "end": {
                              "line": 5,
                              "column": 7,
                              "index": 59
                            },
                            "identifierName": "son"
                          },
                          "name": "son"
                        },
                        "computed": false,
                        "shorthand": false,
                        "value": {
                          "type": "ObjectExpression",
                          "start": 61,
                          "end": 82,
                          "loc": {
                            "start": {
                              "line": 5,
                              "column": 9,
                              "index": 61
                            },
                            "end": {
                              "line": 7,
                              "column": 3,
                              "index": 82
                            }
                          },
                          "properties": [
                            {
                              "type": "ObjectProperty",
                              "start": 67,
                              "end": 78,
                              "loc": {
                                "start": {
                                  "line": 6,
                                  "column": 4,
                                  "index": 67
                                },
                                "end": {
                                  "line": 6,
                                  "column": 15,
                                  "index": 78
                                }
                              },
                              "method": false,
                              "key": {
                                "type": "Identifier",
                                "start": 67,
                                "end": 71,
                                "loc": {
                                  "start": {
                                    "line": 6,
                                    "column": 4,
                                    "index": 67
                                  },
                                  "end": {
                                    "line": 6,
                                    "column": 8,
                                    "index": 71
                                  },
                                  "identifierName": "name"
                                },
                                "name": "name"
                              },
                              "computed": false,
                              "shorthand": false,
                              "value": {
                                "type": "StringLiteral",
                                "start": 73,
                                "end": 78,
                                "loc": {
                                  "start": {
                                    "line": 6,
                                    "column": 10,
                                    "index": 73
                                  },
                                  "end": {
                                    "line": 6,
                                    "column": 15,
                                    "index": 78
                                  }
                                },
                                "extra": {
                                  "rawValue": "333",
                                  "raw": "'333'"
                                },
                                "value": "333"
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        "kind": "var"
      }
    ],
    "directives": []
  },
  "comments": []
}