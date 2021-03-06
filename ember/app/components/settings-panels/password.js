import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  currentPassword: {
    descriptionKey: 'current-password',
    validators: [
      validator('presence', true),
      validator('current-password', {
        messageKey: 'wrong-current-password',
      }),
    ],
    debounce: 500,
  },
  password: {
    descriptionKey: 'password',
    validators: [
      validator('presence', true),
      validator('length', { min: 6 }),
    ],
    debounce: 500,
  },
  passwordConfirmation: validator('confirmation', {
    on: 'password',
    messageKey: 'passwords-do-not-match',
  }),
});

export default Ember.Component.extend(Validations, {
  ajax: Ember.inject.service(),

  classNames: ['panel', 'panel-default'],

  currentPassword: null,
  password: null,
  passwordConfirmation: null,
  pending: false,
  messageKey: null,
  error: null,

  sendChangeRequest() {
    let json = this.getProperties('currentPassword', 'password');

    this.set('pending', true);
    this.get('ajax').request('/settings/', { method: 'POST', json }).then(() => {
      this.setProperties({
        messageKey: 'password-was-changed',
        error: null,
      });
    }).catch(error => {
      this.setProperties({
        messageKey: null,
        error,
      });
    }).finally(() => {
      this.set('pending', false);
    });
  },

  actions: {
    submit() {
      this.validate().then(({ validations }) => {
        if (validations.get('isValid')) {
          this.sendChangeRequest();
        }
      });
    },
  },
});
