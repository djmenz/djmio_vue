// define a mixin object

// eslint-disable-next-line no-unused-vars
const myMixin = {
  created() {
    this.hello();
  },
  methods: {
    hello() {
      console.log('hello from mixin!');
    },
  },
};
