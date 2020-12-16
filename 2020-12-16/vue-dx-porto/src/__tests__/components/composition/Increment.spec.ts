import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Increment from '../../../components/composition/Increment.vue'
import { mockVModel } from '../../utils'



describe("increment composition", () => {

  it('should render', () => {
    const wrapper = mount(Increment, {
      props: {
        value: 11
      }
    })

    expect(wrapper.text()).toBe("Value: 11Increment")
  })

  it('should update on button click', async () => {
    const wrapper = mount(Increment, {
      props: {
        value: 11
      },
    })

    const value = mockVModel(wrapper, 'value')
    expect(wrapper.text()).toBe("Value: 11Increment")
    wrapper.find('button').element.click()

    expect(value.value).toBe(12)

    await nextTick()

    expect(wrapper.text()).toMatch("Value: 12")
  })

  it('should allow to trigger click', async () => {
    const wrapper = mount(Increment, {
      props: {
        value: 11
      },
    })

    const value = mockVModel(wrapper, 'value')
    expect(wrapper.text()).toBe("Value: 11Increment")

    const expected = wrapper.vm.click()

    expect(value.value).toBe(expected)

    await nextTick()

    expect(wrapper.text()).toMatch("Value: 12")
  })
})